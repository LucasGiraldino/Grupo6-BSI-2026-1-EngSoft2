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
}
