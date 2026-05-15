package com.sigaac.controller;

import com.sigaac.model.Agenda;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public class AgendaController {

    private final JsonView json;

    public AgendaController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/agenda/disponivel", this::listarDisponiveis);
        router.get("/api/agenda/disponivel/mes", this::listarDisponiveisMes);
        router.get("/api/agenda/profissional/{id}", this::listarPorProfissional);
        router.post("/api/agenda", this::criar);
        router.put("/api/agenda/{id}", this::atualizar);
        router.delete("/api/agenda/{id}", this::deletar);
    }

    private void listarDisponiveis(HttpExchange exchange, Map<String, String> pathParams) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        Integer idProfissional = null;
        LocalDate data = null;

        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                String[] kv = pair.split("=");
                if (kv.length == 2) {
                    if (kv[0].equals("idProfissional")) idProfissional = Integer.parseInt(kv[1]);
                    if (kv[0].equals("data")) data = LocalDate.parse(kv[1]);
                }
            }
        }

        if (idProfissional == null || data == null) {
            json.error(exchange, 400, "idProfissional e data sao obrigatorios");
            return;
        }

        List<Agenda> agendas = Agenda.findDisponiveisByProfissionalAndData(idProfissional, data);
        json.send(exchange, 200, agendas);
    }

    private void listarDisponiveisMes(HttpExchange exchange, Map<String, String> pathParams) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        Integer idProfissional = null;
        Integer ano = null;
        Integer mes = null;

        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                String[] kv = pair.split("=");
                if (kv.length == 2) {
                    if (kv[0].equals("idProfissional")) idProfissional = Integer.parseInt(kv[1]);
                    if (kv[0].equals("ano")) ano = Integer.parseInt(kv[1]);
                    if (kv[0].equals("mes")) mes = Integer.parseInt(kv[1]);
                }
            }
        }

        if (idProfissional == null || ano == null || mes == null) {
            json.error(exchange, 400, "idProfissional, ano e mes sao obrigatorios");
            return;
        }

        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());

        List<Agenda> agendas = Agenda.findDisponiveisByProfissionalAndDataBetween(idProfissional, inicio, fim);
        json.send(exchange, 200, agendas);
    }

    private void listarPorProfissional(HttpExchange exchange, Map<String, String> pathParams) throws Exception {
        Integer id = Integer.parseInt(pathParams.get("p1"));
        List<Agenda> agendas = Agenda.findByProfissionalId(id);
        json.send(exchange, 200, agendas);
    }

    private void criar(HttpExchange exchange, Map<String, String> pathParams) throws Exception {
        Agenda agenda = json.read(exchange.getRequestBody(), Agenda.class);
        if (agenda.getUsuario() == null || agenda.getUsuario().getId() == null) {
            json.error(exchange, 400, "usuario com id é obrigatório");
            return;
        }
        if (agenda.getData() == null || agenda.getHoraInicio() == null || agenda.getHoraFim() == null) {
            json.error(exchange, 400, "data, horaInicio e horaFim são obrigatórios");
            return;
        }
        agenda.save();
        json.send(exchange, 201, agenda);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> pathParams) throws Exception {
        Integer id = Integer.parseInt(pathParams.get("p1"));
        Agenda agenda = json.read(exchange.getRequestBody(), Agenda.class);
        agenda.setId(id);
        agenda.save();
        json.send(exchange, 200, agenda);
    }

    private void deletar(HttpExchange exchange, Map<String, String> pathParams) throws Exception {
        Integer id = Integer.parseInt(pathParams.get("p1"));
        var db = com.sigaac.config.DatabaseHelper.getInstance();
        db.executeUpdate("DELETE FROM agenda WHERE id_agenda = ?", id);
        json.send(exchange, 204, null);
    }
}
