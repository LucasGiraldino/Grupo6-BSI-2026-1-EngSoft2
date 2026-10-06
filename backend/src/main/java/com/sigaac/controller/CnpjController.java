package com.sigaac.controller;

import com.sigaac.config.CnpjUtil;
import com.sigaac.model.CnpjResponse;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CnpjController {

    private final CnpjUtil cnpjUtil;
    private final JsonView json;

    private CnpjController() {
        this.cnpjUtil = new CnpjUtil();
        this.json = JsonView.getInstance();
    }

    private static class Holder {
        static final CnpjController INSTANCE = new CnpjController();
    }

    public static CnpjController getInstance() {
        return Holder.INSTANCE;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consulta-cnpj/{cnpj}", this::consultar);
    }

    private void consultar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String cnpj = params.get("p1");
        String digitos = cnpj.replaceAll("\\D", "");
        if (digitos.length() != 14) {
            json.send(exchange, 400, CnpjResponse.invalido(digitos, "CNPJ deve conter 14 dígitos."));
            return;
        }
        CnpjResponse response = cnpjUtil.consultar(digitos);
        json.send(exchange, 200, response);
    }
}
