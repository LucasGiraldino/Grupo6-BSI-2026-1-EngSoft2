package com.sigaac.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class CepService {

    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public CepService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.mapper = new ObjectMapper();
    }

    public CepResponseDTO consultar(String cep) {
        if (cep == null || cep.length() != 8) {
            return CepResponseDTO.invalido(cep, "CEP deve conter 8 dígitos.");
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://viacep.com.br/ws/" + cep + "/json/"))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode root = mapper.readTree(response.body());

            if (root.has("erro") && root.get("erro").asBoolean()) {
                return CepResponseDTO.invalido(cep, "CEP não encontrado.");
            }

            return CepResponseDTO.valido(
                    cep,
                    valor(root, "logradouro"),
                    valor(root, "complemento"),
                    valor(root, "bairro"),
                    valor(root, "localidade"),
                    valor(root, "uf")
            );
        } catch (Exception e) {
            return CepResponseDTO.invalido(cep, "Erro ao consultar CEP no ViaCEP.");
        }
    }

    private String valor(JsonNode node, String campo) {
        JsonNode n = node.get(campo);
        return n != null && !n.isNull() ? n.asText() : null;
    }
}
