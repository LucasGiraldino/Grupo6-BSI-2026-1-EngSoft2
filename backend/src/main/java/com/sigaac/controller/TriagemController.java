package com.sigaac.controller;

import com.sigaac.model.Triagem;
import com.sigaac.model.TriagemService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Map;

public class TriagemController {

    private final TriagemService service;
    private final JsonView json;

    public TriagemController(TriagemService service, JsonView json) {
        this.service = service;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/triagens", this::listar);
        router.get("/api/triagens/medicos", this::listarMedicos);
        router.get("/api/triagens/prontuarios", this::listarProntuarios);
        router.get("/api/triagens/{id}", this::buscarPorId);
        router.post("/api/triagens", this::criar);
        router.put("/api/triagens/{id}", this::atualizar);
        router.delete("/api/triagens/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, service.listar());
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = service.buscarPorId(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Triagem não encontrada"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Triagem triagem = json.read(exchange.getRequestBody(), Triagem.class);
        Triagem salvo = service.criar(triagem);
        json.send(exchange, 201, salvo);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (service.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Triagem não encontrada"));
            return;
        }
        Triagem triagem = json.read(exchange.getRequestBody(), Triagem.class);
        Triagem atualizado = service.atualizar(id, triagem);
        json.send(exchange, 200, atualizado);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (service.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Triagem não encontrada"));
            return;
        }
        service.deletar(id);
        json.send(exchange, 204, null);
    }

    private void listarMedicos(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, service.listarMedicos());
    }

    private void listarProntuarios(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String q = null;
        if (query != null && query.startsWith("q=")) {
            q = java.net.URLDecoder.decode(query.substring(2), "UTF-8");
        } else if (query != null && query.contains("&q=")) {
            String[] parts = query.split("&");
            for (String part : parts) {
                if (part.startsWith("q=")) {
                    q = java.net.URLDecoder.decode(part.substring(2), "UTF-8");
                    break;
                }
            }
        }
        List<?> result = (q != null && !q.isBlank())
            ? service.buscarProntuarios(q)
            : service.listarProntuarios();
        json.send(exchange, 200, result);
    }
}
