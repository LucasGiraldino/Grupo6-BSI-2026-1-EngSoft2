package com.sigaac.controller;

import com.sigaac.model.Consulta;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class ConsultaController {

    private final JsonView json;

    public ConsultaController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consultas", this::listar);
        router.post("/api/consultas", this::criar);
        router.put("/api/consultas/{id}", this::atualizar);
        router.delete("/api/consultas/{id}", this::cancelar);
        router.get("/api/consultas/agenda", this::listarPorAgenda);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String status = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2 && "status".equals(pair[0])) {
                    status = java.net.URLDecoder.decode(pair[1], "UTF-8");
                }
            }
        }
        json.send(exchange, 200, Consulta.findAll(status));
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        try {
            Consulta consulta = json.read(exchange.getRequestBody(), Consulta.class);
            consulta.save();
            json.send(exchange, 201, consulta);
        } catch (IllegalArgumentException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        } catch (Exception e) {
            json.send(exchange, 500, Map.of("error", "Erro ao criar consulta."));
        }
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        try {
            Integer id = Integer.parseInt(params.get("p1"));
            var existente = Consulta.findById(id);
            if (existente.isEmpty()) {
                json.send(exchange, 404, Map.of("error", "Consulta não encontrada."));
                return;
            }
            Consulta dados = json.read(exchange.getRequestBody(), Consulta.class);
            Consulta consulta = existente.get();
            if (dados.getPaciente() != null) consulta.setPaciente(dados.getPaciente());
            if (dados.getTipoConsulta() != null) consulta.setTipoConsulta(dados.getTipoConsulta());
            if (dados.getObservacoes() != null) consulta.setObservacoes(dados.getObservacoes());
            if (dados.getStatus() != null) consulta.setStatus(dados.getStatus());
            consulta.save();
            json.send(exchange, 200, consulta);
        } catch (IllegalArgumentException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        } catch (Exception e) {
            json.send(exchange, 500, Map.of("error", "Erro ao atualizar consulta."));
        }
    }

    private void listarPorAgenda(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        Integer profissional = null;
        String dataInicio = null;
        String dataFim = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("profissional".equals(pair[0])) profissional = Integer.parseInt(val);
                    else if ("dataInicio".equals(pair[0])) dataInicio = val;
                    else if ("dataFim".equals(pair[0])) dataFim = val;
                }
            }
        }
        json.send(exchange, 200, Consulta.findByAgendaPeriodo(profissional, dataInicio, dataFim));
    }

    private void cancelar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));

        try {
            var opt = Consulta.findById(id);
            if (opt.isEmpty()) {
                throw new IllegalArgumentException("Consulta não encontrada.");
            }
            Consulta consulta = opt.get();
            consulta.cancelar();
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
