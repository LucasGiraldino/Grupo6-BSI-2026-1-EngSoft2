package com.sigaac.controller;

import com.sigaac.model.TipoExame;
import com.sigaac.model.TipoExameRepository;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class TipoExameController {

    private final TipoExameRepository repository;
    private final JsonView json;

    public TipoExameController(TipoExameRepository repository, JsonView json) {
        this.repository = repository;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/tipos-exame", this::listar);
        router.get("/api/tipos-exame/{id}", this::buscarPorId);
        router.post("/api/tipos-exame", this::criar);
        router.put("/api/tipos-exame/{id}", this::atualizar);
        router.delete("/api/tipos-exame/{id}", this::deletar);
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
            json.send(exchange, 404, Map.of("error", "Tipo de exame não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        TipoExame tipo = json.read(exchange.getRequestBody(), TipoExame.class);
        TipoExame salvo = repository.save(tipo);
        json.send(exchange, 201, salvo);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (repository.findById(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Tipo de exame não encontrado"));
            return;
        }
        TipoExame tipo = json.read(exchange.getRequestBody(), TipoExame.class);
        tipo.setId(id);
        json.send(exchange, 200, repository.save(tipo));
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (repository.findById(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Tipo de exame não encontrado"));
            return;
        }
        repository.delete(id);
        json.send(exchange, 204, null);
    }
}
