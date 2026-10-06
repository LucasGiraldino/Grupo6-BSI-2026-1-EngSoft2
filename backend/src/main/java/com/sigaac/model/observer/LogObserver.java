package com.sigaac.model.observer;

import com.sigaac.model.Consulta;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Observer concreto: registra no log do servidor cada consulta agendada ou cancelada.
 */
public class LogObserver implements ConsultaObserver {

    private static final Logger logger = LoggerFactory.getLogger(LogObserver.class);

    @Override
    public void atualizar(Consulta consulta, EventoConsulta evento) {
        Integer idPaciente = consulta.getPaciente() != null ? consulta.getPaciente().getId() : null;
        logger.info("Consulta {} {} (paciente {})", consulta.getId(), evento, idPaciente);
    }
}
