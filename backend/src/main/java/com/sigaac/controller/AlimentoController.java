package com.sigaac.controller;

import com.sigaac.model.Alimento;
import com.sigaac.model.AlimentoRepository;
import com.sigaac.model.AlimentoService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class AlimentoController {

    private final AlimentoRepository alimentoRepository;
    private final AlimentoService alimentoService;
    private final JsonView json;

    public AlimentoController(AlimentoRepository alimentoRepository, AlimentoService alimentoService, JsonView json) {
        this.alimentoRepository = alimentoRepository;
        this.alimentoService = alimentoService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/alimentos", this::listar);
        router.get("/api/alimentos/{id}", this::buscarPorId);
        router.post("/api/alimentos", this::criar);
        router.put("/api/alimentos/{id}", this::atualizar);
        router.delete("/api/alimentos/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, alimentoRepository.findAll());
    }

    private void buscarPorId(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = alimentoRepository.findById(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Alimento não encontrado"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Alimento body = json.read(exchange.getRequestBody(), Alimento.class);
        Alimento alimento = alimentoService.criar(body);
        json.send(exchange, 201, alimento);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!alimentoRepository.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Alimento não encontrado"));
            return;
        }
        Alimento alimento = json.read(exchange.getRequestBody(), Alimento.class);
        alimento.setId(id);
        json.send(exchange, 200, alimentoRepository.save(alimento));
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        if (!alimentoRepository.existsById(id)) {
            json.send(exchange, 404, Map.of("error", "Alimento não encontrado"));
            return;
        }
        alimentoRepository.deleteById(id);
        json.send(exchange, 204, null);
    }
}
