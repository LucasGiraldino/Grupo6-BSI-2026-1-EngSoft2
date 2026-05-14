package com.sigaac.config;

import com.sigaac.model.CpfResponse;

public class CpfValidator {

    private final String apiToken;

    public CpfValidator(String apiToken) {
        this.apiToken = apiToken != null ? apiToken : "";
    }

    public CpfResponse consultar(String cpf) {
        boolean valido = validarMatematicamente(cpf);
        if (!valido) {
            return CpfResponse.invalido(cpf, "CPF inválido.");
        }

        if (apiToken.isEmpty()) {
            return CpfResponse.mock(cpf, "Cliente Exemplo", "01/01/1990", "MASCULINO");
        }

        try {
            java.net.URL url = new java.net.URL("https://api.cpfhub.io/cpf/" + cpf);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestProperty("Authorization", "Bearer " + apiToken);
            conn.setRequestMethod("GET");

            new String(conn.getInputStream().readAllBytes());
            return CpfResponse.mock(cpf, "Cliente API", "01/01/1990", "MASCULINO");
        } catch (Exception e) {
            return CpfResponse.invalido(cpf, "Erro ao consultar CPF na API.");
        }
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
