package com.sigaac.controller;

import com.sigaac.model.CnpjResponseDTO;
import com.sigaac.model.CnpjService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CnpjController {

    private final CnpjService cnpjService;
    private final JsonView json;

    public CnpjController(CnpjService cnpjService, JsonView json) {
        this.cnpjService = cnpjService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consulta-cnpj/{cnpj}", this::consultar);
    }

    private void consultar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String cnpj = params.get("p1");
        String digitos = cnpj.replaceAll("\\D", "");
        if (digitos.length() != 14) {
            json.send(exchange, 400, CnpjResponseDTO.invalido(digitos, "CNPJ deve conter 14 dígitos."));
            return;
        }
        CnpjResponseDTO response = cnpjService.consultar(digitos);
        json.send(exchange, 200, response);
    }
}
