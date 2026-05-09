package com.sigaac.controller;

import com.sigaac.model.CepResponseDTO;
import com.sigaac.model.CepService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CepController {

    private final CepService cepService;
    private final JsonView json;

    public CepController(CepService cepService, JsonView json) {
        this.cepService = cepService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consulta-cep/{cep}", this::consultar);
    }

    private void consultar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String cep = params.get("p1");
        String digitos = cep.replaceAll("\\D", "");
        if (digitos.length() != 8) {
            json.send(exchange, 400, CepResponseDTO.invalido(digitos, "CEP deve conter 8 dígitos."));
            return;
        }
        CepResponseDTO response = cepService.consultar(digitos);
        json.send(exchange, 200, response);
    }
}
