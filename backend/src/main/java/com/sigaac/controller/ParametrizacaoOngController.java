package com.sigaac.controller;

import com.sigaac.model.*;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ParametrizacaoOngController {

    private final ParametrizacaoOngService service;
    private final UserService userService;
    private final JsonView json;

    public ParametrizacaoOngController(ParametrizacaoOngService service, UserService userService, JsonView json) {
        this.service = service;
        this.userService = userService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/parametrizacao", this::findAll);
        router.get("/api/parametrizacao/{id}", this::findById);
        router.get("/api/parametrizacao/primeira", this::findFirst);
        router.get("/api/parametrizacao/configuracao-sistema", this::getConfiguracaoSistema);
        router.post("/api/parametrizacao", this::create);
        router.put("/api/parametrizacao/{id}", this::update);
        router.delete("/api/parametrizacao/{id}", this::delete);
    }

    private void findAll(HttpExchange exchange, Map<String, String> params) throws Exception {
        List<ParametrizacaoOngDTO> result = service.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        json.send(exchange, 200, result);
    }

    private void findById(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = service.findById(id).map(this::toDTO);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Não encontrado"));
        }
    }

    private void findFirst(HttpExchange exchange, Map<String, String> params) throws Exception {
        var opt = service.findFirst().map(this::toDTO);
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

        ConfiguracaoSistemaDTO config = new ConfiguracaoSistemaDTO();
        boolean isAdmin = email != null && userService.isAdministrador(email);
        config.setUsuarioEhAdministrador(isAdmin);
        var parametrizacaoOpt = service.findFirst();
        config.setParametrizacaoExiste(parametrizacaoOpt.isPresent());
        if (parametrizacaoOpt.isPresent()) {
            config.setParametrizacao(toDTO(parametrizacaoOpt.get()));
        }
        json.send(exchange, 200, config);
    }

    private void create(HttpExchange exchange, Map<String, String> params) throws Exception {
        ParametrizacaoOngRequestDTO request = json.read(exchange.getRequestBody(), ParametrizacaoOngRequestDTO.class);
        ParametrizacaoOng param = toEntity(request);
        ParametrizacaoOng saved = service.save(param);
        json.send(exchange, 201, toDTO(saved));
    }

    private void update(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        ParametrizacaoOngRequestDTO request = json.read(exchange.getRequestBody(), ParametrizacaoOngRequestDTO.class);
        ParametrizacaoOng param = toEntity(request);
        ParametrizacaoOng updated = service.update(id, param);
        json.send(exchange, 200, toDTO(updated));
    }

    private void delete(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        service.delete(id);
        json.send(exchange, 204, null);
    }

    private ParametrizacaoOngDTO toDTO(ParametrizacaoOng param) {
        ParametrizacaoOngDTO dto = new ParametrizacaoOngDTO();
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
            EnderecoDTO endDTO = new EnderecoDTO();
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

    private ParametrizacaoOng toEntity(ParametrizacaoOngRequestDTO request) {
        ParametrizacaoOng param = new ParametrizacaoOng();
        param.setRazaoSocial(request.getRazaoSocial());
        param.setNomeFantasia(request.getNomeFantasia());
        param.setCnpj(request.getCnpj());
        param.setTelefone(request.getTelefone());
        param.setEmail(request.getEmail());
        param.setSite(request.getSite());
        param.setLogoUrl(request.getLogoUrl());
        param.setDataFundacao(request.getDataFundacao());
        param.setObservacoes(request.getObservacoes());
        if (request.getEndereco() != null) {
            Endereco end = new Endereco();
            end.setLogradouro(request.getEndereco().getLogradouro());
            end.setNumero(request.getEndereco().getNumero());
            end.setComplemento(request.getEndereco().getComplemento());
            end.setBairro(request.getEndereco().getBairro());
            end.setCidade(request.getEndereco().getCidade());
            end.setEstado(request.getEndereco().getEstado());
            end.setCep(request.getEndereco().getCep());
            param.setEndereco(end);
        }
        return param;
    }
}
