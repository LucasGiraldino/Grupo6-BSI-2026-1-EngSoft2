package com.sigaac.controller;

import com.sigaac.model.CategoriaAlimento;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CategoriaAlimentoController {

    private final JsonView json;

    public CategoriaAlimentoController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/alimentos/categorias", this::listar);
        router.get("/api/alimentos/categorias/{id}", this::buscarPorId);
        router.post("/api/alimentos/categorias", this::criar);
        router.put("/api/alimentos/categorias/{id}", this::atualizar);
        router.delete("/api/alimentos/categorias/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, CategoriaAlimento.findAll());
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = CategoriaAlimento.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Categoria não encontrada"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        CategoriaAlimento body = json.read(exchange.getRequestBody(), CategoriaAlimento.class);
        json.send(exchange, 201, body.save());
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!CategoriaAlimento.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Categoria não encontrada"));
            return;
        }
        CategoriaAlimento cat = json.read(exchange.getRequestBody(), CategoriaAlimento.class);
        cat.setId(id);
        json.send(exchange, 200, cat.save());
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!CategoriaAlimento.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Categoria não encontrada"));
            return;
        }
        CategoriaAlimento.findById(id).ifPresent(CategoriaAlimento::delete);
        json.send(exchange, 204, null);
    }
}
