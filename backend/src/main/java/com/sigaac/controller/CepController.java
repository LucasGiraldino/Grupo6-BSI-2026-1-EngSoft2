package com.sigaac.controller;

import com.sigaac.config.CepUtil;
import com.sigaac.model.CepResponse;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CepController {

    private final CepUtil cepUtil;
    private final JsonView json;

    private CepController() {
        this.cepUtil = new CepUtil();
        this.json = JsonView.getInstance();
    }

    private static class Holder {
        static final CepController INSTANCE = new CepController();
    }

    public static CepController getInstance() {
        return Holder.INSTANCE;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consulta-cep/{cep}", this::consultar);
    }

    private void consultar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String cep = params.get("p1");
        String digitos = cep.replaceAll("\\D", "");
        if (digitos.length() != 8) {
            json.send(exchange, 400, CepResponse.invalido(digitos, "CEP deve conter 8 dígitos."));
            return;
        }
        CepResponse response = cepUtil.consultar(digitos);
        json.send(exchange, 200, response);
    }
}
