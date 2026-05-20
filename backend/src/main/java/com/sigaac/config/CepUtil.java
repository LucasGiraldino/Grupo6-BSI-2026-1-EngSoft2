package com.sigaac.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sigaac.model.CepResponse;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class CepUtil {

    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public CepUtil() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.mapper = new ObjectMapper();
    }

    public CepResponse consultar(String cep) {
        if (cep == null || cep.length() != 8) {
            return CepResponse.invalido(cep, "CEP deve conter 8 dígitos.");
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://brasilapi.com.br/api/cep/v1/" + cep))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                return CepResponse.invalido(cep, "CEP não encontrado.");
            }

            JsonNode root = mapper.readTree(response.body());

            return CepResponse.valido(
                    cep,
                    valor(root, "street"),
                    null,
                    valor(root, "neighborhood"),
                    valor(root, "city"),
                    valor(root, "state")
            );
        } catch (Exception e) {
            return CepResponse.invalido(cep, "Erro ao consultar CEP na BrasilAPI.");
        }
    }

    private String valor(JsonNode node, String campo) {
        JsonNode n = node.get(campo);
        return n != null && !n.isNull() ? n.asText() : null;
    }
}
