package com.sigaac.controller;

import com.sigaac.config.CnpjUtil;
import com.sigaac.model.Endereco;
import com.sigaac.model.ParametrizacaoOng;
import com.sigaac.model.ParametrizacaoOngResponse;
import com.sigaac.model.ConfiguracaoSistema;
import com.sigaac.model.User;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class ParametrizacaoOngController {

    private final JsonView json;

    public ParametrizacaoOngController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/parametrizacao", this::findAll);
        router.get("/api/parametrizacao/primeira", this::findFirst);
        router.get("/api/parametrizacao/configuracao-sistema", this::getConfiguracaoSistema);
        router.get("/api/parametrizacao/{id}", this::findById);
        router.post("/api/parametrizacao", this::create);
        router.put("/api/parametrizacao/{id}", this::update);
        router.delete("/api/parametrizacao/{id}", this::delete);
    }

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private void findAll(HttpExchange exchange, Map<String, String> params) throws Exception {
        List<ParametrizacaoOngResponse> result = ParametrizacaoOng.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        json.send(exchange, 200, result);
    }

    private void findById(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = ParametrizacaoOng.findById(id).map(this::toDTO);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Não encontrado"));
        }
    }

    private void findFirst(HttpExchange exchange, Map<String, String> params) throws Exception {
        User currentUser = AuthContext.get();
        Optional<ParametrizacaoOngResponse> opt;

        if (currentUser != null && currentUser.getParametrizacaoId() != null) {
            opt = ParametrizacaoOng.findById(currentUser.getParametrizacaoId()).map(this::toDTO);
        } else {
            opt = ParametrizacaoOng.findFirst().map(this::toDTO);
        }

        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Nenhuma parametrização encontrada"));
        }
    }

    private void getConfiguracaoSistema(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String email = null;
        if (query != null && query.startsWith("email=")) {
            email = query.substring(6);
        }

        ConfiguracaoSistema config = new ConfiguracaoSistema();
        boolean isAdmin = email != null && User.findByEmail(email)
            .map(u -> "ADMINISTRADOR".equals(u.getPerfil()))
            .orElse(false);
        config.setUsuarioEhAdministrador(isAdmin);

        User currentUser = AuthContext.get();
        Optional<ParametrizacaoOng> opt;
        if (currentUser != null && currentUser.getParametrizacaoId() != null) {
            opt = ParametrizacaoOng.findById(currentUser.getParametrizacaoId());
        } else {
            opt = ParametrizacaoOng.findFirst();
        }

        config.setParametrizacaoExiste(opt.isPresent());
        opt.ifPresent(p -> config.setParametrizacao(toDTO(p)));
        json.send(exchange, 200, config);
    }

    private String validateRequest(Map<String, Object> request) {
        String cnpj = request.get("cnpj") != null ? ((String) request.get("cnpj")).replaceAll("\\D", "") : null;
        if (cnpj == null || !CnpjUtil.validarMatematicamente(cnpj)) {
            return "CNPJ inválido. Verifique os dígitos.";
        }
        String telefone = request.get("telefone") != null ? ((String) request.get("telefone")).replaceAll("\\D", "") : null;
        if (telefone != null && telefone.length() != 10 && telefone.length() != 11) {
            return "Telefone inválido. Deve ter 10 ou 11 dígitos.";
        }
        String emailVal = (String) request.get("email");
        if (emailVal != null && !emailVal.isEmpty()
                && !EMAIL_PATTERN.matcher(emailVal).matches()) {
            return "E-mail inválido.";
        }
        return null;
    }

    private void create(HttpExchange exchange, Map<String, String> params) throws Exception {
        if (ParametrizacaoOng.findFirst().isPresent()) {
            json.send(exchange, 400, Map.of("error", "Já existe uma parametrização cadastrada. Utilize o método de alteração para modificar."));
            return;
        }
        Map<String, Object> request = json.read(exchange.getRequestBody(), Map.class);
        String error = validateRequest(request);
        if (error != null) {
            json.send(exchange, 400, Map.of("error", error));
            return;
        }
        ParametrizacaoOng param = toEntity(request);
        ParametrizacaoOng saved = param.save();

        User currentUser = AuthContext.get();
        if (currentUser != null && currentUser.getParametrizacaoId() == null) {
            currentUser.setParametrizacaoId(saved.getId());
            currentUser.save();
        }

        json.send(exchange, 201, toDTO(saved));
    }

    private void update(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        Map<String, Object> request = json.read(exchange.getRequestBody(), Map.class);
        String error = validateRequest(request);
        if (error != null) {
            json.send(exchange, 400, Map.of("error", error));
            return;
        }
        ParametrizacaoOng param = toEntity(request);
        param.setId(id);
        ParametrizacaoOng updated = param.save();
        json.send(exchange, 200, toDTO(updated));
    }

    private void delete(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        ParametrizacaoOng.findById(id).ifPresent(ParametrizacaoOng::delete);
        json.send(exchange, 204, null);
    }

    private ParametrizacaoOngResponse toDTO(ParametrizacaoOng param) {
        ParametrizacaoOngResponse dto = new ParametrizacaoOngResponse();
        dto.setId(param.getId());
        dto.setRazaoSocial(param.getRazaoSocial());
        dto.setNomeFantasia(param.getNomeFantasia());
        dto.setCnpj(param.getCnpj());
        dto.setTelefone(param.getTelefone());
        dto.setEmail(param.getEmail());
        dto.setSite(param.getSite());
        dto.setLogoUrl(param.getLogoUrl());
        dto.setDataFundacao(param.getDataFundacao());
        dto.setObservacoes(param.getObservacoes());
        if (param.getEndereco() != null) {
            Endereco endDTO = new Endereco();
            endDTO.setId(param.getEndereco().getId());
            endDTO.setLogradouro(param.getEndereco().getLogradouro());
            endDTO.setNumero(param.getEndereco().getNumero());
            endDTO.setComplemento(param.getEndereco().getComplemento());
            endDTO.setBairro(param.getEndereco().getBairro());
            endDTO.setCidade(param.getEndereco().getCidade());
            endDTO.setEstado(param.getEndereco().getEstado());
            endDTO.setCep(param.getEndereco().getCep());
            dto.setEndereco(endDTO);
        }
        return dto;
    }

    @SuppressWarnings("unchecked")
    private ParametrizacaoOng toEntity(Map<String, Object> request) {
        ParametrizacaoOng param = new ParametrizacaoOng();
        param.setRazaoSocial((String) request.get("razaoSocial"));
        param.setNomeFantasia((String) request.get("nomeFantasia"));
        String cnpj = (String) request.get("cnpj");
        param.setCnpj(cnpj != null ? cnpj.replaceAll("\\D", "") : null);
        String telefone = (String) request.get("telefone");
        param.setTelefone(telefone != null ? telefone.replaceAll("\\D", "") : null);
        param.setEmail((String) request.get("email"));
        param.setSite((String) request.get("site"));
        param.setLogoUrl((String) request.get("logoUrl"));
        Object dataFundacao = request.get("dataFundacao");
        if (dataFundacao instanceof String) {
            param.setDataFundacao(java.time.LocalDate.parse((String) dataFundacao));
        }
        param.setObservacoes((String) request.get("observacoes"));
        Map<String, Object> endMap = (Map<String, Object>) request.get("endereco");
        if (endMap != null) {
            Endereco end = new Endereco();
            end.setLogradouro((String) endMap.get("logradouro"));
            end.setNumero((String) endMap.get("numero"));
            end.setComplemento((String) endMap.get("complemento"));
            end.setBairro((String) endMap.get("bairro"));
            end.setCidade((String) endMap.get("cidade"));
            end.setEstado((String) endMap.get("estado"));
            String cepEnd = (String) endMap.get("cep");
            end.setCep(cepEnd != null ? cepEnd.replaceAll("\\D", "") : null);
            param.setEndereco(end);
        }
        return param;
    }
}
