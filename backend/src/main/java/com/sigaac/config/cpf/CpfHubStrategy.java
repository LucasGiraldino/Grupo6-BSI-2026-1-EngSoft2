package com.sigaac.config.cpf;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sigaac.model.CpfResponse;

public class CpfHubStrategy implements CpfStrategy {

    private final String apiToken;
    private final ObjectMapper mapper;

    public CpfHubStrategy(String apiToken) {
        this.apiToken = apiToken;
        this.mapper = new ObjectMapper();
    }

    @Override
    public CpfResponse consultar(String cpf) {
        try {
            java.net.URL url = new java.net.URL("https://api.cpfhub.io/cpf/" + cpf);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestProperty("Authorization", "Bearer " + apiToken);
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setRequestMethod("GET");

            JsonNode root = mapper.readTree(conn.getInputStream());
            String nome = root.has("nome") && !root.get("nome").isNull()
                ? root.get("nome").asText() : null;
            String dataNascimento = root.has("data_nascimento") && !root.get("data_nascimento").isNull()
                ? root.get("data_nascimento").asText() : null;
            String sexo = root.has("sexo") && !root.get("sexo").isNull()
                ? root.get("sexo").asText() : null;

            return CpfResponse.comDados(cpf, nome, dataNascimento, sexo);
        } catch (Exception e) {
            return CpfResponse.invalido(cpf, "Erro ao consultar CPF na API.");
        }
    }
}
