package com.sigaac.controller;

import com.sigaac.model.Doacao;
import com.sigaac.model.Paciente;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Map;

public class DoacaoController {

    private final JsonView json;

    public DoacaoController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.post("/api/doacoes", this::efetuarDoacao);
        router.get("/api/doacoes", this::listar);
        router.get("/api/doacoes/{id}", this::buscarPorId);
        router.put("/api/doacoes/{id}", this::atualizar);
        router.delete("/api/doacoes/{id}", this::deletar);
    }

    private void efetuarDoacao(HttpExchange exchange, Map<String, String> params) throws Exception {
        Map<String, Object> payload = json.read(exchange.getRequestBody(), Map.class);
        try {
            Integer idPaciente = payload.get("idPaciente") != null
                ? ((Number) payload.get("idPaciente")).intValue() : null;
            Integer idProfissional = payload.get("idProfissional") != null
                ? ((Number) payload.get("idProfissional")).intValue() : null;
            String observacoes = (String) payload.get("observacoes");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itensPayload = (List<Map<String, Object>>) payload.get("itens");

            List<Doacao.ItemDoacaoRequest> itens = new java.util.ArrayList<>();
            if (itensPayload != null) {
                for (Map<String, Object> item : itensPayload) {
                    Integer idAlimento = ((Number) item.get("idAlimento")).intValue();
                    java.math.BigDecimal quantidade = new java.math.BigDecimal(item.get("quantidade").toString());
                    itens.add(new Doacao.ItemDoacaoRequest(idAlimento, quantidade));
                }
            }

            Doacao doacao = Doacao.efetuar(idPaciente, idProfissional, observacoes, itens);
            json.send(exchange, 201, doacao);
        } catch (IllegalArgumentException | IllegalStateException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        } catch (Exception e) {
            json.send(exchange, 500, Map.of("error", "Erro ao processar e atualizar estoque para a doação."));
        }
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var existente = Doacao.findById(id);
        if (existente.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Doação não encontrada."));
            return;
        }
        Map<String, Object> payload = json.read(exchange.getRequestBody(), Map.class);
        try {
            Doacao doacao = existente.get();
            if (payload.containsKey("idPaciente") && payload.get("idPaciente") != null) {
                Integer idPaciente = ((Number) payload.get("idPaciente")).intValue();
                Paciente paciente = Paciente.findById(idPaciente)
                    .orElseThrow(() -> new IllegalArgumentException("Paciente não cadastrado."));
                doacao.setPaciente(paciente);
            }
            if (payload.containsKey("observacoes")) {
                doacao.setObservacoes((String) payload.get("observacoes"));
            }
            doacao.save();
            json.send(exchange, 200, doacao);
        } catch (IllegalArgumentException | IllegalStateException e) {
            json.send(exchange, 400, Map.of("error", e.getMessage()));
        } catch (Exception e) {
            json.send(exchange, 500, Map.of("error", "Erro ao atualizar doação."));
        }
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String nomePaciente = null;
        String dataInicio = null;
        String dataFim = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("nomePaciente".equals(pair[0])) nomePaciente = val;
                    else if ("dataInicio".equals(pair[0])) dataInicio = val;
                    else if ("dataFim".equals(pair[0])) dataFim = val;
                }
            }
        }
        json.send(exchange, 200, Doacao.findAll(nomePaciente, dataInicio, dataFim));
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var doacao = Doacao.findById(id);
        if (doacao.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Doação não encontrada."));
            return;
        }
        json.send(exchange, 200, doacao.get());
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        Doacao.findById(id).ifPresent(Doacao::delete);
        json.send(exchange, 204, null);
    }
}
