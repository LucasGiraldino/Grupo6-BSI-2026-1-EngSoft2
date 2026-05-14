package com.sigaac.controller;

import com.sigaac.config.DatabaseHelper;
import com.sigaac.model.Consulta;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.time.LocalDateTime;
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
        Consulta consulta = json.read(exchange.getRequestBody(), Consulta.class);
        consulta.save();
        json.send(exchange, 201, consulta);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var existente = Consulta.findById(id);
        if (existente.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Consulta não encontrada."));
            return;
        }
        Consulta consulta = json.read(exchange.getRequestBody(), Consulta.class);
        consulta.setId(id);
        consulta.save();
        json.send(exchange, 200, consulta);
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
            if (!"AGENDADA".equals(opt.get().getStatus())) {
                throw new IllegalStateException("A consulta não está no status AGENDADA e não pode ser cancelada.");
            }

            DatabaseHelper.getInstance().executeInTransaction(conn -> {
                var db = DatabaseHelper.getInstance();
                db.executeUpdate(
                    "UPDATE consultas SET status = 'CANCELADA', data_cancelamento = ? WHERE id_consulta = ?",
                    LocalDateTime.now(), id);

                var idAgendaOpt = db.querySingle(
                    "SELECT id_agenda FROM consultas WHERE id_consulta = ?",
                    rs -> rs.getObject("id_agenda", Integer.class), id);

                idAgendaOpt.ifPresent(agId ->
                    db.executeUpdate("UPDATE agenda SET disponivel = TRUE WHERE id_agenda = ?", agId));
            });

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
