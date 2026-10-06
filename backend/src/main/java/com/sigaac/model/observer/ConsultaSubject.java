package com.sigaac.model.observer;

import com.sigaac.model.Consulta;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Padrão Observer - Subject das consultas. Guarda a lista de observadores e
 * avisa todos eles quando uma consulta é agendada ou cancelada.
 * Os observadores entram com assinar() e saem com desassinar().
 * Padrão Singleton - uma única lista de observadores para o sistema inteiro.
 */
public class ConsultaSubject {

    private static final Logger logger = LoggerFactory.getLogger(ConsultaSubject.class);
    private final List<ConsultaObserver> observers = new CopyOnWriteArrayList<>();

    private ConsultaSubject() {}

    private static class Holder {
        static final ConsultaSubject INSTANCE = new ConsultaSubject();
    }

    public static ConsultaSubject getInstance() {
        return Holder.INSTANCE;
    }

    public void assinar(ConsultaObserver observer) {
        observers.add(observer);
    }

    public void desassinar(ConsultaObserver observer) {
        observers.remove(observer);
    }

    public void notificar(Consulta consulta, EventoConsulta evento) {
        for (ConsultaObserver observer : observers) {
            try {
                observer.atualizar(consulta, evento);
            } catch (Exception e) {
                logger.error("Falha no observer {}: {}", observer.getClass().getSimpleName(), e.getMessage());
            }
        }
    }
}
