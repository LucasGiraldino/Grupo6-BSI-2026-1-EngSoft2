package com.sigaac.controller;

import com.sigaac.model.ReceitaMedica;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class ReceitaMedicaController {

    private final JsonView json;

    public ReceitaMedicaController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/receitas", this::listar);
        router.get("/api/receitas/{id}", this::buscarPorId);
        router.post("/api/receitas", this::criar);
        router.put("/api/receitas/{id}", this::atualizar);
        router.delete("/api/receitas/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, ReceitaMedica.findAll());
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = ReceitaMedica.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Receita não encontrada"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        ReceitaMedica receita = json.read(exchange.getRequestBody(), ReceitaMedica.class);
        receita.save();
        json.send(exchange, 201, receita);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = ReceitaMedica.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Receita não encontrada"));
            return;
        }
        ReceitaMedica receita = json.read(exchange.getRequestBody(), ReceitaMedica.class);
        receita.setId(id);
        receita.save();
        json.send(exchange, 200, receita);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = ReceitaMedica.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Receita não encontrada"));
            return;
        }
        opt.get().delete();
        json.send(exchange, 204, null);
    }
}
