package com.sigaac.controller;

import com.sigaac.model.Consulta;
import com.sigaac.model.ConsultaService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class ConsultaController {

    private final ConsultaService service;
    private final JsonView json;

    public ConsultaController(ConsultaService service, JsonView json) {
        this.service = service;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consultas", this::listar);
        router.get("/api/consultas/{id}", this::buscarPorId);
        router.post("/api/consultas", this::criar);
        router.put("/api/consultas/{id}", this::atualizar);
        router.delete("/api/consultas/{id}", this::deletar);
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
            json.send(exchange, 404, Map.of("error", "Consulta não encontrada"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Consulta consulta = json.read(exchange.getRequestBody(), Consulta.class);
        Consulta salvo = service.criar(consulta);
        json.send(exchange, 201, salvo);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (service.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Consulta não encontrada"));
            return;
        }
        Consulta consulta = json.read(exchange.getRequestBody(), Consulta.class);
        Consulta atualizado = service.atualizar(id, consulta);
        json.send(exchange, 200, atualizado);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (service.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Consulta não encontrada"));
            return;
        }
        service.deletar(id);
        json.send(exchange, 204, null);
    }
}
