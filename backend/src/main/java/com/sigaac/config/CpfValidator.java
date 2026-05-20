package com.sigaac.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sigaac.model.CpfResponse;

public class CpfValidator {

    private final String apiToken;
    private final ObjectMapper mapper;

    public CpfValidator(String apiToken) {
        this.apiToken = apiToken != null ? apiToken : "";
        this.mapper = new ObjectMapper();
    }

    public CpfResponse consultar(String cpf) {
        boolean valido = validarMatematicamente(cpf);
        if (!valido) {
            return CpfResponse.invalido(cpf, "CPF inválido.");
        }

        if (apiToken.isEmpty()) {
            return mockDinamico(cpf);
        }

        try {
            java.net.URL url = new java.net.URL("https://api.cpfhub.io/cpf/" + cpf);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestProperty("Authorization", "Bearer " + apiToken);
            conn.setRequestMethod("GET");

            JsonNode root = mapper.readTree(conn.getInputStream());
            String nome = root.has("nome") && !root.get("nome").isNull()
                ? root.get("nome").asText() : null;
            String dataNascimento = root.has("data_nascimento") && !root.get("data_nascimento").isNull()
                ? root.get("data_nascimento").asText() : null;
            String sexo = root.has("sexo") && !root.get("sexo").isNull()
                ? root.get("sexo").asText() : null;

            return CpfResponse.api(cpf, nome, dataNascimento, sexo);
        } catch (Exception e) {
            return CpfResponse.invalido(cpf, "Erro ao consultar CPF na API.");
        }
    }

    private CpfResponse mockDinamico(String cpf) {
        long hash = Long.parseLong(cpf.substring(3, 9));
        String[] nomes = {
            "João", "Pedro", "Carlos", "Antônio", "Francisco", "José", "Paulo",
            "Lucas", "Gabriel", "Rafael", "Marcos", "Felipe", "André", "Bruno",
            "Eduardo", "Diego", "Maria", "Ana", "Carla", "Joana", "Fernanda",
            "Patrícia", "Juliana", "Amanda", "Camila", "Bruna", "Larissa",
            "Letícia", "Vanessa", "Marina", "Beatriz", "Rafaela"
        };
        String[] sobrenomes = {
            "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira",
            "Costa", "Almeida", "Nascimento", "Araújo", "Carvalho",
            "Gomes", "Martins", "Barbosa", "Rocha", "Dias"
        };
        boolean masculino = (cpf.charAt(9) - '0') % 2 == 0;
        String nome = masculino
            ? nomes[(int)(hash % 16)] + " " + sobrenomes[(int)(hash / 16 % 16)]
            : nomes[16 + (int)(hash % 16)] + " " + sobrenomes[(int)(hash / 16 % 16)];
        int ano = 1950 + (int)(hash % 51);
        int mes = 1 + (int)((hash / 51) % 12);
        int dia = 1 + (int)((hash / (51 * 12)) % 28);
        String dataNascimento = String.format("%02d/%02d/%04d", dia, mes, ano);
        String sexo = masculino ? "MASCULINO" : "FEMININO";
        return CpfResponse.mock(cpf, nome, dataNascimento, sexo);
    }

    public static boolean validarMatematicamente(String cpf) {
        if (cpf == null || cpf.length() != 11) return false;
        if (cpf.chars().allMatch(c -> c == cpf.charAt(0))) return false;

        try {
            int soma = 0;
            for (int i = 0; i < 9; i++) soma += (cpf.charAt(i) - '0') * (10 - i);
            int dig1 = 11 - (soma % 11);
            if (dig1 > 9) dig1 = 0;
            if (dig1 != cpf.charAt(9) - '0') return false;

            soma = 0;
            for (int i = 0; i < 10; i++) soma += (cpf.charAt(i) - '0') * (11 - i);
            int dig2 = 11 - (soma % 11);
            if (dig2 > 9) dig2 = 0;
            return dig2 == cpf.charAt(10) - '0';
        } catch (Exception e) {
            return false;
        }
    }
}
