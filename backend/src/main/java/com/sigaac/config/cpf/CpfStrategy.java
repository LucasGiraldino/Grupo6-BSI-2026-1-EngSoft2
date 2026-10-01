package com.sigaac.config.cpf;

import com.sigaac.model.CpfResponse;

public interface CpfStrategy {

    CpfResponse consultar(String cpf);
}
