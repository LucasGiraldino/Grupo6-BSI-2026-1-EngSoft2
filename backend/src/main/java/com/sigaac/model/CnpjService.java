package com.sigaac.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class CnpjService {

    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public CnpjService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.mapper = new ObjectMapper();
    }

    public CnpjResponseDTO consultar(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) {
            return CnpjResponseDTO.invalido(cnpj, "CNPJ deve conter 14 dígitos.");
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.receitaws.com.br/v1/cnpj/" + cnpj))
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode root = mapper.readTree(response.body());

            String status = root.has("status") ? root.get("status").asText() : "";
            if (!"OK".equals(status)) {
                String msg = root.has("message") ? root.get("message").asText() : "CNPJ não encontrado.";
                return CnpjResponseDTO.invalido(cnpj, msg);
            }

            return CnpjResponseDTO.valido(
                    cnpj,
                    valor(root, "nome"),
                    valor(root, "fantasia"),
                    valor(root, "logradouro"),
                    valor(root, "numero"),
                    valor(root, "complemento"),
                    valor(root, "bairro"),
                    valor(root, "municipio"),
                    valor(root, "uf"),
                    valor(root, "cep"),
                    valor(root, "telefone"),
                    valor(root, "email")
            );
        } catch (Exception e) {
            return CnpjResponseDTO.invalido(cnpj, "Erro ao consultar CNPJ na ReceitaWS.");
        }
    }

    private String valor(JsonNode node, String campo) {
        JsonNode n = node.get(campo);
        return n != null && !n.isNull() ? n.asText() : null;
    }
}
