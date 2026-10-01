package com.sigaac.config;

import com.sigaac.config.cpf.CpfStrategy;
import com.sigaac.model.CpfResponse;

public class CpfValidator {

    private final CpfStrategy strategy;

    public CpfValidator(CpfStrategy strategy) {
        this.strategy = strategy;
    }

    public CpfResponse consultar(String cpf) {
        if (!validarMatematicamente(cpf)) {
            return CpfResponse.invalido(cpf, "CPF inválido.");
        }
        return strategy.consultar(cpf);
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
