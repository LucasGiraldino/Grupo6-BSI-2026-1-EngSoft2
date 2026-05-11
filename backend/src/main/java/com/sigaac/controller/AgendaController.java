package com.sigaac.controller;

import com.sigaac.model.Agenda;
import com.sigaac.model.AgendaRepository;
import com.sigaac.view.JsonView;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AgendaController {

    private final AgendaRepository repository;
    private final JsonView json;

    public AgendaController(AgendaRepository repository, JsonView json) {
        this.repository = repository;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/agenda/disponivel", this::listarDisponiveis);
        router.get("/api/agenda/disponivel/mes", this::listarDisponiveisMes);
    }

    private void listarDisponiveis(com.sun.net.httpserver.HttpExchange exchange, Map<String, String> pathParams) throws Exception {
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

        List<Agenda> agendas = repository.findDisponiveisByProfissionalAndData(idProfissional, data);
        json.send(exchange, 200, agendas);
    }

    private void listarDisponiveisMes(com.sun.net.httpserver.HttpExchange exchange, Map<String, String> pathParams) throws Exception {
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

        List<Agenda> agendas = repository.findDisponiveisByProfissionalAndDataBetween(idProfissional, inicio, fim);
        json.send(exchange, 200, agendas);
    }
}
