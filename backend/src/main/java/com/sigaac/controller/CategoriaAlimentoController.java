package com.sigaac.controller;

import com.sigaac.model.CategoriaAlimento;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Optional;

public class CategoriaAlimentoController extends CrudController<CategoriaAlimento> {

    private CategoriaAlimentoController() {
        super(JsonView.getInstance());
    }

    private static class Holder {
        static final CategoriaAlimentoController INSTANCE = new CategoriaAlimentoController();
    }

    public static CategoriaAlimentoController getInstance() {
        return Holder.INSTANCE;
    }

    @Override
    protected String basePath() {
        return "/api/alimentos/categorias";
    }

    @Override
    protected Class<CategoriaAlimento> type() {
        return CategoriaAlimento.class;
    }

    @Override
    protected List<CategoriaAlimento> listarTodos(HttpExchange exchange) {
        return CategoriaAlimento.findAll();
    }

    @Override
    protected void criarRegistro(HttpExchange exchange) throws Exception {
        CategoriaAlimento categoria = json.read(exchange.getRequestBody(), CategoriaAlimento.class);
        json.send(exchange, 201, categoria.save());
    }

    @Override
    protected Optional<CategoriaAlimento> buscarPorId(Integer id) {
        return CategoriaAlimento.findById(id);
    }

    @Override
    protected CategoriaAlimento persistir(CategoriaAlimento categoria) {
        return categoria.save();
    }

    @Override
    protected void remover(CategoriaAlimento categoria) {
        categoria.delete();
    }

    @Override
    protected CategoriaAlimento aplicarId(CategoriaAlimento categoria, Integer id) {
        categoria.setId(id);
        return categoria;
    }

    @Override
    protected String naoEncontrado() {
        return "Categoria não encontrada";
    }
}