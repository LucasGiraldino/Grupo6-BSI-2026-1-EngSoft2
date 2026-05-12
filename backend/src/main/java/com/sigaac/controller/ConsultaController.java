package com.sigaac.controller;

import com.sigaac.model.ConsultaService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class ConsultaController {

    private final ConsultaService consultaService;
    private final JsonView json;

    public ConsultaController(ConsultaService consultaService, JsonView json) {
        this.consultaService = consultaService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consultas", this::listar);
        router.delete("/api/consultas/{id}", this::cancelar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        var consultas = consultaService.listar();
        json.send(exchange, 200, consultas);
    }

    private void cancelar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));

        try {
            consultaService.cancelar(id);
            json.send(exchange, 200, Map.of("message", "Consulta cancelada com sucesso."));
        } catch (IllegalArgumentException e) {
            json.send(exchange, 404, Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        } catch (Exception e) {
            json.send(exchange, 500, Map.of("error", "Erro ao cancelar consulta."));
        }
    }
}
