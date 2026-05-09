package com.sigaac.controller;

import com.sigaac.model.CpfResponseDTO;
import com.sigaac.model.CpfService;
import com.sigaac.view.JsonView;
import com.sun.net.httpserver.HttpExchange;

import java.util.Map;

public class CpfController {

    private final CpfService cpfService;
    private final JsonView json;

    public CpfController(CpfService cpfService, JsonView json) {
        this.cpfService = cpfService;
        this.json = json;
    }

    public void registerRoutes(HttpRouter router) {
        router.get("/api/consulta-cpf/{cpf}", this::consultar);
    }

    private void consultar(HttpExchange exchange, Map<String, String> params) throws Exception {
        String cpf = params.get("p1");
        String digitos = cpf.replaceAll("\\D", "");
        if (digitos.length() != 11) {
            json.send(exchange, 400, CpfResponseDTO.invalido(digitos, "CPF deve conter 11 dígitos."));
            return;
        }
        CpfResponseDTO response = cpfService.consultar(digitos);
        json.send(exchange, 200, response);
    }
}
