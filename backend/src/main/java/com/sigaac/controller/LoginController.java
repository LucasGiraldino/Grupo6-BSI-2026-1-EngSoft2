package com.sigaac.controller;

import com.sigaac.model.*;
import com.sun.net.httpserver.HttpExchange;
import com.sigaac.view.JsonView;
import org.mindrot.jbcrypt.BCrypt;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class LoginController {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final TokenService tokenService;
    private final RateLimiterService rateLimiterService;
    private final JsonView json;
    private final ConcurrentHashMap<String, Instant> pendingVerifications = new ConcurrentHashMap<>();
    private static final long PENDING_TTL_MINUTES = 10;

    public LoginController(UserRepository userRepository,
                           OtpService otpService, TokenService tokenService,
                           RateLimiterService rateLimiterService, JsonView json) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.tokenService = tokenService;
        this.rateLimiterService = rateLimiterService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.post("/auth/login", this::login);
        router.post("/auth/verify", this::verify);
        router.post("/auth/logout", this::logout);
        router.post("/auth/refresh", this::refresh);
    }

    private void login(HttpExchange exchange, Map<String, String> params) throws Exception {
        LoginRequestDTO data = json.read(exchange.getRequestBody(), LoginRequestDTO.class);
        String rateLimitKey = "login:" + data.email();

        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            json.send(exchange, 429, Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
            return;
        }

        var userOpt = userRepository.findByEmail(data.email());
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas"));
            return;
        }

        var user = userOpt.get();

        if (user.getDeletedAt() != null || !user.getAtivo()) {
            json.send(exchange, 403, Map.of("error", "Conta desabilitada"));
            return;
        }

        if (!user.isAccountNonLocked()) {
            json.send(exchange, 423, Map.of("error", "Conta bloqueada por muitas tentativas. Tente novamente em 15 minutos."));
            return;
        }

        if (!BCrypt.checkpw(data.senha(), user.getSenhaHash())) {
            user.incrementFailedAttempts();
            userRepository.save(user);
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas"));
            return;
        }

        pendingVerifications.put(user.getEmail(), Instant.now().plusSeconds(PENDING_TTL_MINUTES * 60));
        otpService.generateAndSendOtp(user.getEmail());
        json.send(exchange, 200, Map.of("message", "Código 2FA enviado para o email do usuário.", "otpSent", true));
    }

    private void verify(HttpExchange exchange, Map<String, String> params) throws Exception {
        VerifyRequestDTO data = json.read(exchange.getRequestBody(), VerifyRequestDTO.class);
        String rateLimitKey = "verify:" + data.email();

        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            json.send(exchange, 429, Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
            return;
        }

        Instant expiresAt = pendingVerifications.get(data.email());
        if (expiresAt == null || Instant.now().isAfter(expiresAt)) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas."));
            return;
        }

        if (!otpService.validateOtp(data.email(), data.codigo())) {
            json.send(exchange, 401, Map.of("error", "Código inválido ou expirado"));
            return;
        }

        var userOpt = userRepository.findByEmail(data.email());
        if (userOpt.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Credenciais inválidas."));
            return;
        }

        var user = userOpt.get();

        if (!user.isAccountNonLocked()) {
            json.send(exchange, 423, Map.of("error", "Conta bloqueada por muitas tentativas. Tente novamente em 15 minutos."));
            return;
        }

        user.resetFailedAttempts();
        userRepository.save(user);

        String token = tokenService.generateToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);
        rateLimiterService.reset(rateLimitKey);
        pendingVerifications.remove(data.email());

        json.send(exchange, 200, Map.of(
                "accessToken", token,
                "refreshToken", refreshToken,
                "expiresIn", 7200
        ));
    }

    private void logout(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, Map.of("message", "Logout realizado."));
    }

    private void refresh(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, String> body = json.read(exchange.getRequestBody(), Map.class);
        String refreshToken = body.get("refreshToken");

        if (refreshToken == null) {
            json.send(exchange, 401, Map.of("error", "Refresh token inválido"));
            return;
        }

        String email = tokenService.validateRefreshToken(refreshToken);
        if (email.isEmpty()) {
            json.send(exchange, 401, Map.of("error", "Refresh token inválido ou expirado"));
            return;
        }

        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            json.send(exchange, 401, Map.of("error", "Usuário não encontrado"));
            return;
        }

        String newToken = tokenService.generateToken(user);
        json.send(exchange, 200, Map.of("accessToken", newToken, "expiresIn", 7200));
    }
}
