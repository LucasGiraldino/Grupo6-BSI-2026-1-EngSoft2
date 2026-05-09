package com.sigaac.controller;

import com.sigaac.model.Paciente;
import com.sigaac.model.PacienteService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class PacienteController {

    private final PacienteService pacienteService;
    private final JsonView json;

    public PacienteController(PacienteService pacienteService, JsonView json) {
        this.pacienteService = pacienteService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/pacientes", this::listar);
        router.get("/api/pacientes/{id}", this::buscarPorId);
        router.post("/api/pacientes", this::criar);
        router.put("/api/pacientes/{id}", this::atualizar);
        router.delete("/api/pacientes/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, pacienteService.listar());
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = pacienteService.buscarPorId(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Paciente não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Paciente paciente = json.read(exchange.getRequestBody(), Paciente.class);
        Paciente salvo = pacienteService.criar(paciente);
        json.send(exchange, 201, salvo);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (pacienteService.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Paciente não encontrado"));
            return;
        }
        Paciente paciente = json.read(exchange.getRequestBody(), Paciente.class);
        Paciente atualizado = pacienteService.atualizar(id, paciente);
        json.send(exchange, 200, atualizado);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (pacienteService.buscarPorId(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Paciente não encontrado"));
            return;
        }
        pacienteService.deletar(id);
        json.send(exchange, 204, null);
    }
}
