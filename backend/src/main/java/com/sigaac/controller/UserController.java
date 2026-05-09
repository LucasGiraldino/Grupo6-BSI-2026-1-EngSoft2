package com.sigaac.controller;

import com.sigaac.model.User;
import com.sigaac.model.UserRepository;
import com.sigaac.model.UserRole;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class UserController {

    private final UserRepository userRepository;
    private final JsonView json;

    public UserController(UserRepository userRepository, JsonView json) {
        this.userRepository = userRepository;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.put("/apis/user/{id}/perfil", this::changeUserProfile);
    }

    private void changeUserProfile(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        Map<String, String> payload = json.read(exchange.getRequestBody(), Map.class);
        String novoPerfil = payload.get("perfil");

        if (novoPerfil == null || novoPerfil.isEmpty()) {
            json.send(exchange, 400, Map.of("error", "Perfil inválido."));
            return;
        }

        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Usuário não encontrado"));
            return;
        }

        User user = userOpt.get();
        user.setPerfil(UserRole.valueOf(novoPerfil.toUpperCase()));
        userRepository.save(user);
        json.send(exchange, 200, Map.of("message", "Perfil atualizado com sucesso para: " + novoPerfil));
    }
}
