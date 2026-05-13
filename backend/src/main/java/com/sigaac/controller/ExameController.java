package com.sigaac.controller;

import com.sigaac.model.Exame;
import com.sigaac.model.ExameService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Map;

public class ExameController {

    private final ExameService service;
    private final JsonView json;

    public ExameController(ExameService service, JsonView json) {
        this.service = service;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/exames", this::listar);
        router.get("/api/exames/medicos", this::listarMedicos);
        router.get("/api/exames/prontuarios", this::listarProntuarios);
        router.get("/api/exames/{id}", this::buscarPorId);
        router.post("/api/exames", this::criar);
        router.put("/api/exames/{id}", this::atualizar);
        router.delete("/api/exames/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String status = null;
        Integer tipoExameId = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String key = pair[0];
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("status".equals(key)) status = val;
                    else if ("tipoExameId".equals(key)) {
                        try { tipoExameId = Integer.parseInt(val); } catch (NumberFormatException e) {}
                    }
                }
            }
        }
        json.send(exchange, 200, service.listar(status, tipoExameId));
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = service.buscarPorId(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Exame não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Exame exame = json.read(exchange.getRequestBody(), Exame.class);
        Exame salvo = service.criar(exame);
        json.send(exchange, 201, salvo);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (service.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Exame não encontrado"));
            return;
        }
        Exame exame = json.read(exchange.getRequestBody(), Exame.class);
        Exame atualizado = service.atualizar(id, exame);
        json.send(exchange, 200, atualizado);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (service.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Exame não encontrado"));
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
