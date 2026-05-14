package com.sigaac.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sigaac.model.CnpjResponse;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class CnpjUtil {

    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public CnpjUtil() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.mapper = new ObjectMapper();
    }

    public CnpjResponse consultar(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) {
            return CnpjResponse.invalido(cnpj, "CNPJ deve conter 14 dígitos.");
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
                return CnpjResponse.invalido(cnpj, msg);
            }

            return CnpjResponse.valido(
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
            return CnpjResponse.invalido(cnpj, "Erro ao consultar CNPJ na ReceitaWS.");
        }
    }

    public static boolean validarMatematicamente(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) return false;
        if (cnpj.chars().allMatch(c -> c == cnpj.charAt(0))) return false;

        try {
            int[] pesos1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
            int soma = 0;
            for (int i = 0; i < 12; i++) soma += (cnpj.charAt(i) - '0') * pesos1[i];
            int dig1 = 11 - (soma % 11);
            if (dig1 > 9) dig1 = 0;
            if (dig1 != cnpj.charAt(12) - '0') return false;

            int[] pesos2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
            soma = 0;
            for (int i = 0; i < 13; i++) soma += (cnpj.charAt(i) - '0') * pesos2[i];
            int dig2 = 11 - (soma % 11);
            if (dig2 > 9) dig2 = 0;
            return dig2 == cnpj.charAt(13) - '0';
        } catch (Exception e) {
            return false;
        }
    }

    private String valor(JsonNode node, String campo) {
        JsonNode n = node.get(campo);
        return n != null && !n.isNull() ? n.asText() : null;
    }
}
