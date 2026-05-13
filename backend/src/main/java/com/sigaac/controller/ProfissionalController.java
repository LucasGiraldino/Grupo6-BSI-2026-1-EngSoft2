package com.sigaac.controller;

import com.sigaac.model.Profissional;
import com.sigaac.model.ProfissionalRepository;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Map;

public class ProfissionalController {

    private final ProfissionalRepository repository;
    private final JsonView json;

    public ProfissionalController(ProfissionalRepository repository, JsonView json) {
        this.repository = repository;
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
        List<Profissional> profissionais = repository.findAll();
        json.send(exchange, 200, profissionais);
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = repository.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Profissional não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Profissional profissional = json.read(exchange.getRequestBody(), Profissional.class);
        Profissional salvo = repository.save(profissional);
        json.send(exchange, 201, salvo);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (repository.findById(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Profissional não encontrado"));
            return;
        }
        Profissional profissional = json.read(exchange.getRequestBody(), Profissional.class);
        profissional.setId(id);
        Profissional atualizado = repository.save(profissional);
        json.send(exchange, 200, atualizado);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (repository.findById(id).isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Profissional não encontrado"));
            return;
        }
        repository.deleteById(id);
        json.send(exchange, 204, null);
    }
}
