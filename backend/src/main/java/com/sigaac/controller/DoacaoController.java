package com.sigaac.controller;

import com.sigaac.model.Doacao;
import com.sigaac.model.DoacaoRequestDTO;
import com.sigaac.model.DoacaoService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class DoacaoController {

    private final DoacaoService doacaoService;
    private final JsonView json;

    public DoacaoController(DoacaoService doacaoService, JsonView json) {
        this.doacaoService = doacaoService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.post("/api/doacoes", this::efetuarDoacao);
        router.get("/api/doacoes", this::listar);
        router.get("/api/doacoes/{id}", this::buscarPorId);
        router.put("/api/doacoes/{id}", this::atualizar);
        router.delete("/api/doacoes/{id}", this::deletar);
    }

    private void efetuarDoacao(HttpExchange exchange, Map<String, String> params) throws Exception {
        DoacaoRequestDTO dto = json.read(exchange.getRequestBody(), DoacaoRequestDTO.class);
        try {
            Doacao novaDoacao = doacaoService.efetuarDoacao(dto);
            json.send(exchange, 201, novaDoacao);
        } catch (IllegalArgumentException | IllegalStateException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        } catch (Exception e) {
            json.send(exchange, 500, Map.of("error", "Erro ao processar e atualizar estoque para a doação."));
        }
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var existente = doacaoService.buscarPorId(id);
        if (existente.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Doação não encontrada."));
            return;
        }
        DoacaoRequestDTO dto = json.read(exchange.getRequestBody(), DoacaoRequestDTO.class);
        try {
            Doacao atualizada = doacaoService.atualizar(id, dto);
            json.send(exchange, 200, atualizada);
        } catch (IllegalArgumentException | IllegalStateException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        } catch (Exception e) {
            json.send(exchange, 500, Map.of("error", "Erro ao atualizar doação."));
        }
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String nomePaciente = null;
        String dataInicio = null;
        String dataFim = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("nomePaciente".equals(pair[0])) nomePaciente = val;
                    else if ("dataInicio".equals(pair[0])) dataInicio = val;
                    else if ("dataFim".equals(pair[0])) dataFim = val;
                }
            }
        }
        var doacoes = doacaoService.listarTodas(nomePaciente, dataInicio, dataFim);
        json.send(exchange, 200, doacoes);
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var doacao = doacaoService.buscarPorId(id);
        if (doacao.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Doação não encontrada."));
            return;
        }
        json.send(exchange, 200, doacao.get());
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        doacaoService.deletar(id);
        json.send(exchange, 204, null);
    }
}
