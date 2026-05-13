package com.sigaac.controller;

import com.sigaac.model.Compra;
import com.sigaac.model.CompraDTO;
import com.sigaac.model.CompraService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CompraController {

    private final CompraService compraService;
    private final JsonView json;

    public CompraController(CompraService compraService, JsonView json) {
        this.compraService = compraService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/compras", this::listar);
        router.get("/api/compras/{id}", this::buscar);
        router.post("/api/compras", this::criar);
        router.put("/api/compras/{id}", this::atualizar);
        router.delete("/api/compras/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String query = exchange.getRequestURI().getQuery();
        String dataInicio = null;
        String dataFim = null;
        String observacoes = null;
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2) {
                    String key = pair[0];
                    String val = java.net.URLDecoder.decode(pair[1], "UTF-8");
                    if ("dataInicio".equals(key)) dataInicio = val;
                    else if ("dataFim".equals(key)) dataFim = val;
                    else if ("observacoes".equals(key)) observacoes = val;
                }
            }
        }
        json.send(exchange, 200, compraService.listarTodas(dataInicio, dataFim, observacoes));
    }

    private void buscar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = compraService.buscarPorId(id);
        if (opt.isPresent()) {
            json.send(exchange, 200, opt.get());
        } else {
            json.send(exchange, 404, Map.of("error", "Compra não encontrada"));
        }
    }

    private void criar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Compra compra = json.read(exchange.getRequestBody(), Compra.class);
        CompraDTO salva = compraService.salvar(compra);
        json.send(exchange, 201, salva);
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = compraService.buscarPorId(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Compra não encontrada"));
            return;
        }
        Compra compra = json.read(exchange.getRequestBody(), Compra.class);
        compra.setId(id);
        CompraDTO atualizada = compraService.salvar(compra);
        json.send(exchange, 200, atualizada);
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = compraService.buscarPorId(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", "Compra não encontrada"));
            return;
        }
        compraService.deletar(id);
        json.send(exchange, 204, null);
    }
}
