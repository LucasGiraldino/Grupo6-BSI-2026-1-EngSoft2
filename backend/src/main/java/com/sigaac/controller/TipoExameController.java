package com.sigaac.controller;

import com.sigaac.model.TipoExame;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class TipoExameController {

    private final JsonView json;

    public TipoExameController(JsonView json) {
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
        json.send(exchange, 200, TipoExame.findAll());
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = TipoExame.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Tipo de exame não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        TipoExame tipo = json.read(exchange.getRequestBody(), TipoExame.class);
        json.send(exchange, 201, tipo.save());
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (TipoExame.findById(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Tipo de exame não encontrado"));
            return;
        }
        TipoExame tipo = json.read(exchange.getRequestBody(), TipoExame.class);
        tipo.setId(id);
        json.send(exchange, 200, tipo.save());
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (TipoExame.findById(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Tipo de exame não encontrado"));
            return;
        }
        TipoExame.findById(id).ifPresent(TipoExame::delete);
        json.send(exchange, 204, null);
    }
}
