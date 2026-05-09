package com.sigaac.model;

import java.time.LocalDateTime;

public class Consulta {

    private Integer id;
    private Paciente paciente;
    private Agenda agenda;
    private Profissional profissional;
    private String tipoConsulta;
    private String status;
    private String observacoes;
    private LocalDateTime dataAgendamento;
    private LocalDateTime dataCancelamento;

    public Consulta() {}

    public Consulta(Integer id, Paciente paciente, Agenda agenda, Profissional profissional,
                    String tipoConsulta, String status, String observacoes,
                    LocalDateTime dataAgendamento, LocalDateTime dataCancelamento) {
        this.id = id;
        this.paciente = paciente;
        this.agenda = agenda;
        this.profissional = profissional;
        this.tipoConsulta = tipoConsulta;
        this.status = status;
        this.observacoes = observacoes;
        this.dataAgendamento = dataAgendamento;
        this.dataCancelamento = dataCancelamento;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public Agenda getAgenda() { return agenda; }
    public void setAgenda(Agenda agenda) { this.agenda = agenda; }
    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }
    public String getTipoConsulta() { return tipoConsulta; }
    public void setTipoConsulta(String tipoConsulta) { this.tipoConsulta = tipoConsulta; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public LocalDateTime getDataAgendamento() { return dataAgendamento; }
    public void setDataAgendamento(LocalDateTime dataAgendamento) { this.dataAgendamento = dataAgendamento; }
    public LocalDateTime getDataCancelamento() { return dataCancelamento; }
    public void setDataCancelamento(LocalDateTime dataCancelamento) { this.dataCancelamento = dataCancelamento; }
}
