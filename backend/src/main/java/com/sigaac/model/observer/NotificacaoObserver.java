package com.sigaac.model.observer;

import com.sigaac.model.Agenda;
import com.sigaac.model.Consulta;
import com.sigaac.model.Notificacao;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Observer concreto: grava uma notificação para o paciente (tabela notificacoes)
 * sempre que uma consulta dele é agendada ou cancelada.
 */
public class NotificacaoObserver implements ConsultaObserver {

    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter HORA = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    public void atualizar(Consulta consulta, EventoConsulta evento) {
        Consulta completa = Consulta.findById(consulta.getId()).orElse(consulta);
        if (completa.getPaciente() == null || completa.getPaciente().getId() == null) return;

        Notificacao notificacao = new Notificacao();
        notificacao.setPaciente(completa.getPaciente());
        notificacao.setTipo(evento == EventoConsulta.AGENDADA ? "AGENDAMENTO" : "CANCELAMENTO");
        notificacao.setMensagem(montarMensagem(completa, evento));
        notificacao.setDataEnvio(LocalDateTime.now());
        notificacao.setStatusEnvio("PENDENTE");
        notificacao.save();
    }

    private String montarMensagem(Consulta consulta, EventoConsulta evento) {
        String quando = "";
        Agenda agenda = consulta.getAgenda();
        if (agenda != null && agenda.getData() != null) {
            quando = " " + agenda.getData().format(DATA);
            if (agenda.getHoraInicio() != null) {
                quando += " às " + agenda.getHoraInicio().format(HORA);
            }
        }
        if (evento == EventoConsulta.AGENDADA) {
            return quando.isEmpty()
                    ? "Sua consulta foi agendada."
                    : "Sua consulta foi agendada para" + quando + ".";
        }
        return quando.isEmpty()
                ? "Sua consulta foi cancelada."
                : "Sua consulta do dia" + quando + " foi cancelada.";
    }
}
