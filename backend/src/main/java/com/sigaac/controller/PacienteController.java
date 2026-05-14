package com.sigaac.controller;

import com.sigaac.model.Endereco;
import com.sigaac.model.Paciente;
import com.sigaac.model.Prontuario;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.time.LocalDate;
import java.util.Map;

public class PacienteController {

    private final JsonView json;

    public PacienteController(JsonView json) {
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
        String query = exchange.getRequestURI().getQuery();
        String nome = null;
        String cpf = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String key = pair[0];
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("nome".equals(key)) nome = val;
                    else if ("cpf".equals(key)) cpf = val;
                }
            }
        }
        json.send(exchange, 200, Paciente.findAll(nome, cpf));
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Paciente.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Paciente não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Paciente paciente = json.read(exchange.getRequestBody(), Paciente.class);
        try {
            paciente.validar();
            if (paciente.getDataCadastro() == null) {
                paciente.setDataCadastro(LocalDate.now());
            }
            if (paciente.getEndereco() != null && paciente.getEndereco().getId() == null) {
                paciente.setEndereco(paciente.getEndereco().save());
            }
            paciente.save();
            new Prontuario(paciente).save();
            json.send(exchange, 201, paciente);
        } catch (IllegalArgumentException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        }
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Paciente.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Paciente não encontrado"));
            return;
        }
        Paciente paciente = json.read(exchange.getRequestBody(), Paciente.class);
        paciente.setId(id);
        if (paciente.getEndereco() != null && paciente.getEndereco().getId() == null) {
            paciente.setEndereco(paciente.getEndereco().save());
        }
        paciente.save();
        json.send(exchange, 200, paciente);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Paciente.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Paciente não encontrado"));
            return;
        }
        opt.get().delete();
        json.send(exchange, 204, null);
    }
}
