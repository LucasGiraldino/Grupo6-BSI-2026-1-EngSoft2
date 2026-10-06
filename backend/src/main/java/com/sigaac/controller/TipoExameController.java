package com.sigaac.controller;

import com.sigaac.model.TipoExame;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.List;
import java.util.Optional;

public class TipoExameController extends CrudController<TipoExame> {

    private TipoExameController() {
        super(JsonView.getInstance());
    }

    private static class Holder {
        static final TipoExameController INSTANCE = new TipoExameController();
    }

    public static TipoExameController getInstance() {
        return Holder.INSTANCE;
    }

    @Override
    protected String basePath() {
        return "/api/tipos-exame";
    }

    @Override
    protected Class<TipoExame> type() {
        return TipoExame.class;
    }

    @Override
    protected List<TipoExame> listarTodos(HttpExchange exchange) {
        return TipoExame.findAll();
    }

    @Override
    protected void criarRegistro(HttpExchange exchange) throws Exception {
        TipoExame tipo = json.read(exchange.getRequestBody(), TipoExame.class);
        json.send(exchange, 201, tipo.save());
    }

    @Override
    protected Optional<TipoExame> buscarPorId(Integer id) {
        return TipoExame.findById(id);
    }

    @Override
    protected TipoExame persistir(TipoExame tipo) {
        return tipo.save();
    }

    @Override
    protected void remover(TipoExame tipo) {
        tipo.delete();
    }

    @Override
    protected TipoExame aplicarId(TipoExame tipo, Integer id) {
        tipo.setId(id);
        return tipo;
    }

    @Override
    protected String naoEncontrado() {
        return "Tipo de exame não encontrado";
    }
}