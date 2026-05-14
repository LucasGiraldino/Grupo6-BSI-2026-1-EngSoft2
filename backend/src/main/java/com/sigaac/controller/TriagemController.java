package com.sigaac.controller;

import com.sigaac.model.Consulta;
import com.sigaac.model.Medico;
import com.sigaac.model.Prontuario;
import com.sigaac.model.Triagem;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class TriagemController {

    private final JsonView json;

    public TriagemController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/triagens", this::listar);
        router.get("/api/triagens/medicos", this::listarMedicos);
        router.get("/api/triagens/prontuarios", this::listarProntuarios);
        router.get("/api/triagens/{id}", this::buscarPorId);
        router.post("/api/triagens", this::criar);
        router.put("/api/triagens/{id}", this::atualizar);
        router.delete("/api/triagens/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String nomePaciente = null;
        Integer medicoId = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String key = pair[0];
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("nomePaciente".equals(key)) nomePaciente = val;
                    else if ("medicoId".equals(key)) {
                        try { medicoId = Integer.parseInt(val); } catch (NumberFormatException e) {}
                    }
                }
            }
        }
        json.send(exchange, 200, Triagem.findAll(nomePaciente, medicoId));
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Triagem.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Triagem não encontrada"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Triagem triagem = json.read(exchange.getRequestBody(), Triagem.class);
        if (triagem.getProntuario() == null || Prontuario.findById(triagem.getProntuario().getId()).isEmpty()) {
            json.send(exchange, 400, Map.of("error", "Prontuário não encontrado. Cadastre o paciente primeiro."));
            return;
        }
        triagem.save();
        var prontuarioOpt = Prontuario.findById(triagem.getProntuario().getId());
        prontuarioOpt.ifPresent(prontuario -> {
            Consulta consulta = new Consulta();
            consulta.setPaciente(prontuario.getPaciente());
            consulta.setTriagem(triagem);
            consulta.setTipoConsulta("Triagem");
            consulta.setStatus("ESPERANDO");
            consulta.setDataAgendamento(LocalDateTime.now());
            consulta.setObservacoes("Aguardando agendamento");
            consulta.save();
        });
        json.send(exchange, 201, triagem);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Triagem.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Triagem não encontrada"));
            return;
        }
        Triagem request = json.read(exchange.getRequestBody(), Triagem.class);
        Triagem atualizado = opt.get().merge(request);
        atualizado.save();
        json.send(exchange, 200, atualizado);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Triagem.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Triagem não encontrada"));
            return;
        }
        opt.get().delete();
        json.send(exchange, 204, null);
    }

    private void listarMedicos(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, Medico.findAll());
    }

    private void listarProntuarios(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String q = null;
        if (query != null && query.startsWith("q=")) {
            q = java.net.URLDecoder.decode(query.substring(2), "UTF-8");
        } else if (query != null && query.contains("&q=")) {
            String[] parts = query.split("&");
            for (String part : parts) {
                if (part.startsWith("q=")) {
                    q = java.net.URLDecoder.decode(part.substring(2), "UTF-8");
                    break;
                }
            }
        }
        List<?> result = (q != null && !q.isBlank())
            ? Prontuario.search(q)
            : Prontuario.findAll();
        json.send(exchange, 200, result);
    }
}
