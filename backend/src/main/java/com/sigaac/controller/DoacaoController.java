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

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        var doacoes = doacaoService.listarTodas();
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
