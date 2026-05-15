package com.sigaac.controller;

import com.sigaac.model.Estoque;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class EstoqueController {

    private final JsonView json;

    public EstoqueController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/estoque", this::listar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, Estoque.findAll());
    }
}
