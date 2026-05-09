package com.sigaac.controller;

import com.sigaac.model.CategoriaAlimento;
import com.sigaac.model.CategoriaAlimentoRepository;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CategoriaAlimentoController {

    private final CategoriaAlimentoRepository repository;
    private final JsonView json;

    public CategoriaAlimentoController(CategoriaAlimentoRepository repository, JsonView json) {
        this.repository = repository;
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
        json.send(exchange, 200, repository.findAll());
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = repository.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Categoria não encontrada"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        CategoriaAlimento body = json.read(exchange.getRequestBody(), CategoriaAlimento.class);
        json.send(exchange, 201, repository.save(body));
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!repository.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Categoria não encontrada"));
            return;
        }
        CategoriaAlimento cat = json.read(exchange.getRequestBody(), CategoriaAlimento.class);
        cat.setId(id);
        json.send(exchange, 200, repository.save(cat));
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!repository.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Categoria não encontrada"));
            return;
        }
        repository.deleteById(id);
        json.send(exchange, 204, null);
    }
}
