package com.sigaac.controller;

import com.sigaac.model.User;
import com.sigaac.model.UserRepository;
import com.sigaac.model.UserRole;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class UserController {

    private final UserRepository userRepository;
    private final JsonView json;

    public UserController(UserRepository userRepository, JsonView json) {
        this.userRepository = userRepository;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.post("/apis/user", this::createUser);
        router.get("/apis/user", this::listUsers);
        router.get("/apis/user/{id}", this::getUser);
        router.put("/apis/user/{id}/perfil", this::changeUserProfile);
        router.delete("/apis/user/{id}", this::deleteUser);
    }

    private void createUser(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, String> payload = json.read(exchange.getRequestBody(), Map.class);
        String nome = payload.get("nome");
        String email = payload.get("email");
        String cpf = payload.get("cpf");
        String senha = payload.get("senha");
        String perfilStr = payload.getOrDefault("perfil", "USUARIO");

        if (nome == null || email == null || cpf == null || senha == null) {
            json.send(exchange, 400, Map.of("error", "Campos obrigatórios: nome, email, cpf, senha"));
            return;
        }

        if (userRepository.findByEmail(email).isPresent()) {
            json.send(exchange, 409, Map.of("error", "Email já cadastrado"));
            return;
        }

        if (userRepository.findByCpf(cpf).isPresent()) {
            json.send(exchange, 409, Map.of("error", "CPF já cadastrado"));
            return;
        }

        UserRole role;
        try {
            role = UserRole.valueOf(perfilStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            json.send(exchange, 400, Map.of("error", "Perfil inválido. Use ADMIN ou USUARIO"));
            return;
        }

        User user = new User();
        user.setNome(nome);
        user.setEmail(email);
        user.setCpf(cpf);
        user.setSenhaHash(BCrypt.hashpw(senha, BCrypt.gensalt()));
        user.setPerfil(role);
        user.setDataCadastro(LocalDate.now());
        user.setAtivo(true);

        userRepository.save(user);

        json.send(exchange, 201, Map.of(
                "message", "Usuário criado com sucesso",
                "id", user.getId()
        ));
    }

    private void listUsers(HttpExchange exchange, Map<String, String> params) throws Exception {
        List<Map<String, Object>> safeUsers = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "nome", u.getNome(),
                        "email", u.getEmail(),
                        "cpf", u.getCpf(),
                        "perfil", u.getPerfil(),
                        "ativo", u.getAtivo(),
                        "dataCadastro", u.getDataCadastro() != null ? u.getDataCadastro().toString() : null
                ))
                .toList();
        json.send(exchange, 200, safeUsers);
    }

    private void getUser(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Usuário não encontrado"));
            return;
        }
        User u = userOpt.get();
        json.send(exchange, 200, Map.of(
                "id", u.getId(),
                "nome", u.getNome(),
                "email", u.getEmail(),
                "cpf", u.getCpf(),
                "perfil", u.getPerfil(),
                "ativo", u.getAtivo(),
                "dataCadastro", u.getDataCadastro() != null ? u.getDataCadastro().toString() : null
        ));
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

    private void deleteUser(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Usuário não encontrado"));
            return;
        }
        userRepository.deleteById(id);
        json.send(exchange, 200, Map.of("message", "Usuário desativado com sucesso"));
    }
}
