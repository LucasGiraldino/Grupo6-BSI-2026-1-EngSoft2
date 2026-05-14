package com.sigaac.controller;

import com.sigaac.config.CpfValidator;
import com.sigaac.model.CpfResponse;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CpfController {

    private final CpfValidator cpfValidator;
    private final JsonView json;

    public CpfController(CpfValidator cpfValidator, JsonView json) {
        this.cpfValidator = cpfValidator;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consulta-cpf/{cpf}", this::consultar);
    }

    private void consultar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String cpf = params.get("p1");
        String digitos = cpf.replaceAll("\\D", "");
        if (digitos.length() != 11) {
            json.send(exchange, 400, CpfResponse.invalido(digitos, "CPF deve conter 11 dígitos."));
            return;
        }
        CpfResponse response = cpfValidator.consultar(digitos);
        json.send(exchange, 200, response);
    }
}
