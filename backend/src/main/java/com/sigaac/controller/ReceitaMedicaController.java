package com.sigaac.controller;

import com.sigaac.model.ReceitaMedica;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Optional;

public class ReceitaMedicaController extends CrudController<ReceitaMedica> {

    public ReceitaMedicaController(JsonView json) {
        super(json);
    }

    @Override
    protected String basePath() {
        return "/api/receitas";
    }

    @Override
    protected Class<ReceitaMedica> type() {
        return ReceitaMedica.class;
    }

    @Override
    protected List<ReceitaMedica> listarTodos(HttpExchange exchange) {
        return ReceitaMedica.findAll();
    }

    @Override
    protected void criarRegistro(HttpExchange exchange) throws Exception {
        ReceitaMedica receita = json.read(exchange.getRequestBody(), ReceitaMedica.class);
        json.send(exchange, 201, receita.save());
    }

    @Override
    protected Optional<ReceitaMedica> buscarPorId(Integer id) {
        return ReceitaMedica.findById(id);
    }

    @Override
    protected ReceitaMedica persistir(ReceitaMedica receita) {
        return receita.save();
    }

    @Override
    protected void remover(ReceitaMedica receita) {
        receita.delete();
    }

    @Override
    protected ReceitaMedica aplicarId(ReceitaMedica receita, Integer id) {
        receita.setId(id);
        return receita;
    }

    @Override
    protected String naoEncontrado() {
        return "Receita não encontrada";
    }
}