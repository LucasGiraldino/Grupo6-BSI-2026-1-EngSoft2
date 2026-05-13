package com.sigaac.controller;

import com.sigaac.model.User;
import com.sigaac.model.UserRepository;
import com.sigaac.model.TokenService;
import com.sigaac.model.UserRole;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

public class SecurityFilter extends Filter {

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final JsonView json;

    public SecurityFilter(TokenService tokenService, UserRepository userRepository, JsonView json) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.json = json;
    }

    @Override
    public void doFilter(HttpExchange exchange, Chain chain) throws IOException {
        String path = exchange.getRequestURI().getRawPath();
        String method = exchange.getRequestMethod();

        var token = recoverToken(exchange);
        if (token != null) {
            var email = tokenService.validateToken(token);
            if (!email.isEmpty()) {
                var user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    AuthContext.set(user);
                }
            }
        }

        try {
            User currentUser = AuthContext.get();
            if (currentUser == null) {
                if (!isPublic(path, method)) {
                    json.send(exchange, 401, Map.of("error", "Unauthorized"));
                    return;
                }
            } else if (isAdminRequired(path, method) && currentUser.getRole() != UserRole.ADMIN) {
                json.send(exchange, 403, Map.of("error", "Acesso restrito a administradores"));
                return;
            }
            chain.doFilter(exchange);
        } finally {
            AuthContext.clear();
        }
    }

    private boolean isAdminRequired(String path, String method) {
        if (path.startsWith("/apis/user")) return true;
        if (path.startsWith("/api/parametrizacao")
                && !path.equals("/api/parametrizacao/configuracao-sistema")) return true;
        return false;
    }

    private boolean isPublic(String path, String method) {
        if (path.equals("/auth/login") && method.equals("POST")) return true;
        if (path.equals("/auth/verify") && method.equals("POST")) return true;
        if (path.equals("/auth/refresh") && method.equals("POST")) return true;
        if (path.equals("/api/parametrizacao/configuracao-sistema") && method.equals("GET")) return true;
        return false;
    }

    private String recoverToken(HttpExchange exchange) {
        var authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }

    @Override
    public String description() {
        return "JWT Security Filter";
    }
}
