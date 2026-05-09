package com.sigaac.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UnidadeMedida {
    KG("KG"),
    G("G"),
    L("L"),
    ML("ML"),
    UNIDADE("UNIDADE"),
    CAIXA("CAIXA"),
    PACOTE("PACOTE");

    private final String valor;

    UnidadeMedida(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static UnidadeMedida fromValor(String valor) {
        for (UnidadeMedida u : values()) {
            if (u.valor.equalsIgnoreCase(valor)) {
                return u;
            }
        }
        throw new IllegalArgumentException("Unidade de medida invalida: " + valor);
    }
}
