package com.sigaac.controller;

import com.sigaac.model.Prontuario;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class ProntuarioController {

    private final JsonView json;

    public ProntuarioController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/prontuarios", this::listar);
        router.get("/api/prontuarios/{id}", this::buscarPorId);
        router.put("/api/prontuarios/{id}", this::atualizar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String q = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2 && "q".equals(pair[0])) {
                    q = java.net.URLDecoder.decode(pair[1], "UTF-8");
                }
            }
        }
        if (q != null && !q.isBlank()) {
            json.send(exchange, 200, Prontuario.search(q));
        } else {
            json.send(exchange, 200, Prontuario.findAll());
        }
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Prontuario.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Prontuário não encontrado"));
        }
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Prontuario.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Prontuário não encontrado"));
            return;
        }
        Prontuario prontuario = json.read(exchange.getRequestBody(), Prontuario.class);
        prontuario.setId(id);
        prontuario.save();
        json.send(exchange, 200, prontuario);
    }
}
