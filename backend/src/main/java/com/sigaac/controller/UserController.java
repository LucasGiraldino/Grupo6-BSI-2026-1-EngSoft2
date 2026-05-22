package com.sigaac.controller;

import com.sigaac.config.CpfValidator;
import com.sigaac.model.Endereco;
import com.sigaac.model.User;
import com.sigaac.model.UserRole;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class UserController {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final JsonView json;

    public UserController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.post("/apis/user", this::createUser);
        router.get("/apis/user", this::listUsers);
        router.get("/apis/user/{id}", this::getUser);
        router.put("/apis/user/{id}", this::updateUser);
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

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            json.send(exchange, 400, Map.of("error", "E-mail inválido."));
            return;
        }

        if (User.findByEmail(email).isPresent()) {
            json.send(exchange, 409, Map.of("error", "Email já cadastrado"));
            return;
        }

        if (User.findByCpf(cpf).isPresent()) {
            json.send(exchange, 409, Map.of("error", "CPF já cadastrado"));
            return;
        }

        if (!CpfValidator.validarMatematicamente(cpf)) {
            json.send(exchange, 400, Map.of("error", "CPF inválido. Verifique os dígitos."));
            return;
        }

        UserRole role;
        if (User.count() == 0) {
            role = UserRole.ADMIN;
        } else {
            try {
                role = UserRole.valueOf(perfilStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                json.send(exchange, 400, Map.of("error", "Perfil inválido. Use ADMIN ou USUARIO"));
                return;
            }
        }

        User user = new User();
        user.setNome(nome);
        user.setEmail(email);
        user.setCpf(cpf);
        user.setSenhaHash(BCrypt.hashpw(senha, BCrypt.gensalt()));
        user.setPerfil(role);
        user.setDataCadastro(LocalDate.now());
        user.setAtivo(true);

        String dataNascimento = payload.get("dataNascimento");
        if (dataNascimento != null && !dataNascimento.isBlank()) {
            user.setDataNascimento(LocalDate.parse(dataNascimento));
        }

        String telefone = payload.get("telefone");
        if (telefone != null && !telefone.isBlank()) {
            user.setTelefone(telefone);
        }

        Endereco endereco = extractEnderecoFromPayload(payload);
        if (endereco != null) {
            user.setEndereco(endereco.save());
        }

        user.save();

        json.send(exchange, 201, Map.of(
                "message", "Usuário criado com sucesso",
                "id", user.getId()
        ));
    }

    private void listUsers(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String nome = null;
        String perfil = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String key = pair[0];
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("nome".equals(key)) nome = val;
                    else if ("perfil".equals(key)) perfil = val;
                }
            }
        }
        List<Map<String, Object>> safeUsers = User.findAll(nome, perfil).stream()
                .map(u -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", u.getId());
                    map.put("nome", u.getNome());
                    map.put("email", u.getEmail());
                    map.put("cpf", u.getCpf());
                    map.put("perfil", u.getPerfil());
                    map.put("ativo", u.getAtivo());
                    map.put("dataCadastro", u.getDataCadastro() != null ? u.getDataCadastro().toString() : null);
                    map.put("dataNascimento", u.getDataNascimento() != null ? u.getDataNascimento().toString() : null);
                    map.put("telefone", u.getTelefone());
                    map.put("endereco", u.getEndereco());
                    return map;
                })
                .toList();
        json.send(exchange, 200, safeUsers);
    }

    private void getUser(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var userOpt = User.findById(id);
        if (userOpt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Usuário não encontrado"));
            return;
        }
        User u = userOpt.get();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", u.getId());
        response.put("nome", u.getNome());
        response.put("email", u.getEmail());
        response.put("cpf", u.getCpf());
        response.put("perfil", u.getPerfil());
        response.put("ativo", u.getAtivo());
        response.put("dataCadastro", u.getDataCadastro() != null ? u.getDataCadastro().toString() : null);
        response.put("dataNascimento", u.getDataNascimento() != null ? u.getDataNascimento().toString() : null);
        response.put("telefone", u.getTelefone());
        response.put("endereco", u.getEndereco());
        json.send(exchange, 200, response);
    }

    private void updateUser(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        Map<String, String> payload = json.read(exchange.getRequestBody(), Map.class);

        var userOpt = User.findById(id);
        if (userOpt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Usuário não encontrado"));
            return;
        }

        User user = userOpt.get();

        String nome = payload.get("nome");
        String email = payload.get("email");
        String cpf = payload.get("cpf");
        String senha = payload.get("senha");
        String perfilStr = payload.get("perfil");

        if (nome != null && !nome.isBlank()) {
            user.setNome(nome.trim());
        }

        if (email != null && !email.isBlank()) {
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                json.send(exchange, 400, Map.of("error", "E-mail inválido."));
                return;
            }
            var existing = User.findByEmail(email.trim());
            if (existing.isPresent() && !existing.get().getId().equals(id)) {
                json.send(exchange, 409, Map.of("error", "Email já cadastrado"));
                return;
            }
            user.setEmail(email.trim());
        }

        if (cpf != null && !cpf.isBlank()) {
            if (!CpfValidator.validarMatematicamente(cpf)) {
                json.send(exchange, 400, Map.of("error", "CPF inválido. Verifique os dígitos."));
                return;
            }
            var existing = User.findByCpf(cpf);
            if (existing.isPresent() && !existing.get().getId().equals(id)) {
                json.send(exchange, 409, Map.of("error", "CPF já cadastrado"));
                return;
            }
            user.setCpf(cpf);
        }

        if (senha != null && !senha.isEmpty()) {
            user.setSenhaHash(BCrypt.hashpw(senha, BCrypt.gensalt()));
        }

        if (perfilStr != null && !perfilStr.isBlank()) {
            UserRole novaRole;
            try {
                novaRole = UserRole.valueOf(perfilStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                json.send(exchange, 400, Map.of("error", "Perfil inválido. Use ADMIN ou USUARIO"));
                return;
            }

            String perfilAtual = user.getRole() != null ? user.getRole().name() : null;
            if ("ADMIN".equals(perfilAtual) && !"ADMIN".equals(novaRole.name())) {
                long adminsAtivos = User.countByPerfil("ADMIN");
                if (adminsAtivos <= 1) {
                    json.send(exchange, 400, Map.of("error", "Não é possível rebaixar o único administrador do sistema."));
                    return;
                }
            }
            user.setPerfil(novaRole);
        }

        String dataNascimento = payload.get("dataNascimento");
        if (dataNascimento != null && !dataNascimento.isBlank()) {
            user.setDataNascimento(LocalDate.parse(dataNascimento));
        }

        String telefone = payload.get("telefone");
        if (telefone != null) {
            user.setTelefone(telefone.isBlank() ? null : telefone);
        }

        Endereco endereco = extractEnderecoFromPayload(payload);
        if (endereco != null) {
            if (user.getEndereco() != null) {
                endereco.setId(user.getEndereco().getId());
            }
            user.setEndereco(endereco.save());
        }

        user.save();

        json.send(exchange, 200, Map.of(
                "message", "Usuário atualizado com sucesso",
                "id", user.getId()
        ));
    }

    private Endereco extractEnderecoFromPayload(Map<String, String> payload) {
        String enderecoCep = payload.get("enderecoCep");
        String enderecoLogradouro = payload.get("enderecoLogradouro");
        String enderecoNumero = payload.get("enderecoNumero");
        String enderecoComplemento = payload.get("enderecoComplemento");
        String enderecoBairro = payload.get("enderecoBairro");
        String enderecoCidade = payload.get("enderecoCidade");
        String enderecoEstado = payload.get("enderecoEstado");
        String enderecoPais = payload.get("enderecoPais");

        boolean hasAddress = enderecoCep != null && !enderecoCep.isBlank();
        if (!hasAddress) return null;

        Endereco e = new Endereco();
        e.setCep(enderecoCep);
        e.setLogradouro(enderecoLogradouro != null ? enderecoLogradouro : "");
        e.setNumero(enderecoNumero != null ? enderecoNumero : "");
        e.setComplemento(enderecoComplemento);
        e.setBairro(enderecoBairro != null ? enderecoBairro : "");
        e.setCidade(enderecoCidade != null ? enderecoCidade : "");
        e.setEstado(enderecoEstado != null ? enderecoEstado : "");
        e.setPais(enderecoPais != null ? enderecoPais : "Brasil");
        return e;
    }

    private void changeUserProfile(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        Map<String, String> payload = json.read(exchange.getRequestBody(), Map.class);
        String novoPerfil = payload.get("perfil");

        if (novoPerfil == null || novoPerfil.isEmpty()) {
            json.send(exchange, 400, Map.of("error", "Perfil inválido."));
            return;
        }

        var userOpt = User.findById(id);
        if (userOpt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Usuário não encontrado"));
            return;
        }

        User user = userOpt.get();
        String perfilAtual = user.getRole() != null ? user.getRole().name() : null;

        if ("ADMIN".equals(perfilAtual) && !"ADMIN".equals(novoPerfil.toUpperCase())) {
            long adminsAtivos = User.countByPerfil("ADMIN");
            if (adminsAtivos <= 1) {
                json.send(exchange, 400, Map.of("error", "Não é possível rebaixar o único administrador do sistema."));
                return;
            }
        }

        user.setPerfil(UserRole.valueOf(novoPerfil.toUpperCase()));
        user.save();
        json.send(exchange, 200, Map.of("message", "Perfil atualizado com sucesso para: " + novoPerfil));
    }

    private void deleteUser(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var userOpt = User.findById(id);
        if (userOpt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Usuário não encontrado"));
            return;
        }

        User user = userOpt.get();
        String perfilAtual = user.getRole() != null ? user.getRole().name() : null;

        if ("ADMIN".equals(perfilAtual)) {
            long adminsAtivos = User.countByPerfil("ADMIN");
            if (adminsAtivos <= 1) {
                json.send(exchange, 400, Map.of("error", "Não é possível desativar o único administrador do sistema."));
                return;
            }
        }

        user.delete();
        json.send(exchange, 200, Map.of("message", "Usuário desativado com sucesso"));
    }
}
