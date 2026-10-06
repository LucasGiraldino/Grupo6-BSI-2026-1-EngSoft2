package com.sigaac.model.observer;

import com.sigaac.model.Consulta;

/**
 * Padrão Observer - interface dos observadores de consulta. Quem implementa
 * é avisado pelo ConsultaSubject quando uma consulta é agendada ou cancelada.
 */
public interface ConsultaObserver {

    void atualizar(Consulta consulta, EventoConsulta evento);
}
