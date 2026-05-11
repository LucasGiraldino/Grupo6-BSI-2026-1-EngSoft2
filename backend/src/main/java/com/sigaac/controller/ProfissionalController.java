package com.sigaac.controller;

import com.sigaac.model.Profissional;
import com.sigaac.model.ProfissionalRepository;
import com.sigaac.view.JsonView;

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
    }

    private void listar(com.sun.net.httpserver.HttpExchange exchange, Map<String, String> pathParams) throws Exception {
        List<Profissional> profissionais = repository.findAll();
        json.send(exchange, 200, profissionais);
    }
}
