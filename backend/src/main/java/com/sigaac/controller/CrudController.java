package com.sigaac.controller;

import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public abstract class CrudController<T> {

    protected final JsonView json;

    protected CrudController(JsonView json) {
        this.json = json;
    }

    protected abstract String basePath();

    protected abstract Class<T> type();

    protected abstract List<T> listarTodos(HttpExchange exchange);

    protected abstract void criarRegistro(HttpExchange exchange) throws Exception;

    protected abstract Optional<T> buscarPorId(Integer id);

    protected abstract T persistir(T entity);

    protected abstract void remover(T entity);

    protected String naoEncontrado() {
        return "Recurso não encontrado";
    }

    protected T aplicarId(T entity, Integer id) {
        return entity;
    }

    public final void registerRoutes(HttpRouter router) {
        router.get(basePath(), this::listar);
        router.get(basePath() + "/{id}", this::buscarPorIdHandler);
        router.post(basePath(), this::criarHandler);
        router.put(basePath() + "/{id}", this::atualizar);
        router.delete(basePath() + "/{id}", this::deletar);
    }

    private void listar(HttpExchange exchange, Map<String, String> params) throws Exception {
        json.send(exchange, 200, listarTodos(exchange));
    }

    private void criarHandler(HttpExchange exchange, Map<String, String> params) throws Exception {
        criarRegistro(exchange);
    }

    private void buscarPorIdHandler(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = buscarPorId(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", naoEncontrado()));
            return;
        }
        json.send(exchange, 200, opt.get());
    }

    private void atualizar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = buscarPorId(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", naoEncontrado()));
            return;
        }
        T entity = json.read(exchange.getRequestBody(), type());
        json.send(exchange, 200, persistir(aplicarId(entity, id)));
    }

    private void deletar(HttpExchange exchange, Map<String, String> params) throws Exception {
        Integer id = Integer.parseInt(params.get("p1"));
        var opt = buscarPorId(id);
        if (opt.isEmpty()) {
            json.send(exchange, 404, Map.of("error", naoEncontrado()));
            return;
        }
        remover(opt.get());
        json.send(exchange, 204, null);
    }
}