package com.sigaac.controller;

import com.sigaac.model.Alimento;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class AlimentoController {

    private final JsonView json;

    public AlimentoController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/alimentos", this::listar);
        router.get("/api/alimentos/{id}", this::buscarPorId);
        router.post("/api/alimentos", this::criar);
        router.put("/api/alimentos/{id}", this::atualizar);
        router.delete("/api/alimentos/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String nome = null;
        Integer categoriaId = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String key = pair[0];
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("nome".equals(key)) nome = val;
                    else if ("categoriaId".equals(key)) {
                        try { categoriaId = Integer.parseInt(val); } catch (NumberFormatException e) {}
                    }
                }
            }
        }
        json.send(exchange, 200, Alimento.findAll(nome, categoriaId));
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Alimento.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Alimento não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Alimento body = json.read(exchange.getRequestBody(), Alimento.class);
        Alimento alimento = body.criarComEstoque();
        json.send(exchange, 201, alimento);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!Alimento.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Alimento não encontrado"));
            return;
        }
        Alimento alimento = json.read(exchange.getRequestBody(), Alimento.class);
        alimento.setId(id);
        alimento.save();
        json.send(exchange, 200, alimento);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!Alimento.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Alimento não encontrado"));
            return;
        }
        Alimento.findById(id).ifPresent(Alimento::delete);
        json.send(exchange, 204, null);
    }
}
