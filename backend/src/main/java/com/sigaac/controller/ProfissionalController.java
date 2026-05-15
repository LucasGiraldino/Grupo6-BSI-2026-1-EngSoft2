package com.sigaac.controller;

import com.sigaac.model.Medico;
import com.sigaac.model.Profissional;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class ProfissionalController {

    private final JsonView json;

    public ProfissionalController(JsonView json) {
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/profissionais", this::listar);
        router.get("/api/profissionais/{id}", this::buscarPorId);
        router.post("/api/profissionais", this::criar);
        router.put("/api/profissionais/{id}", this::atualizar);
        router.delete("/api/profissionais/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String nome = null;
        String especialidade = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("nome".equals(pair[0])) nome = val;
                    else if ("especialidade".equals(pair[0])) especialidade = val;
                }
            }
        }
        json.send(exchange, 200, Profissional.findAll(nome, especialidade));
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Profissional.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Profissional não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Profissional profissional = json.read(exchange.getRequestBody(), Profissional.class);
        Integer usuarioId = profissional.getUsuario() != null ? profissional.getUsuario().getId() : null;
        if (usuarioId != null) {
            var existente = Profissional.findByUsuarioId(usuarioId);
            if (existente.isPresent()) {
                json.send(exchange, 409, Map.of("error", "Este usuário já possui um profissional vinculado"));
                return;
            }
        }
        profissional.save();
        syncMedico(profissional);
        json.send(exchange, 201, profissional);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (Profissional.findById(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Profissional não encontrado"));
            return;
        }
        Profissional profissional = json.read(exchange.getRequestBody(), Profissional.class);
        profissional.setId(id);
        profissional.save();
        syncMedico(profissional);
        json.send(exchange, 200, profissional);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = Profissional.findById(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Profissional não encontrado"));
            return;
        }
        Profissional profissional = opt.get();
        Integer usuarioId = profissional.getUsuario() != null ? profissional.getUsuario().getId() : null;
        if (usuarioId != null) {
            Medico.findByUsuarioId(usuarioId).ifPresent(Medico::delete);
        }
        profissional.delete();
        json.send(exchange, 204, null);
    }

    private void syncMedico(Profissional profissional) {
        Integer usuarioId = profissional.getUsuario() != null ? profissional.getUsuario().getId() : null;
        if (usuarioId == null) return;

        var optMedico = Medico.findByUsuarioId(usuarioId);

        if (Boolean.TRUE.equals(profissional.getEhMedico())) {
            if (optMedico.isPresent()) {
                Medico medico = optMedico.get();
                medico.setCrm(profissional.getRegistroProfissional());
                medico.setEspecialidadeMedica(profissional.getEspecialidade());
                medico.setDataAdmissao(profissional.getDataAdmissao());
                medico.save();
            } else {
                Medico medico = new Medico();
                medico.setUsuario(profissional.getUsuario());
                medico.setCrm(profissional.getRegistroProfissional());
                medico.setEspecialidadeMedica(profissional.getEspecialidade());
                medico.setDataAdmissao(profissional.getDataAdmissao());
                medico.save();
            }
        } else {
            optMedico.ifPresent(Medico::delete);
        }
    }
}
