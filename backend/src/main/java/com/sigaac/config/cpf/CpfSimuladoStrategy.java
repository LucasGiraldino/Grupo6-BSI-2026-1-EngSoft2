package com.sigaac.config.cpf;

import com.sigaac.model.CpfResponse;

public class CpfSimuladoStrategy implements CpfStrategy {

    @Override
    public CpfResponse consultar(String cpf) {
        return CpfResponse.valido(cpf);
    }
}
