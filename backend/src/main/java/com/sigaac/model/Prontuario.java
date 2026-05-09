package com.sigaac.model;

import java.time.LocalDate;

public class Prontuario {

    private Integer id;
    private Medico medico;
    private User usuario;
    private Paciente paciente;
    private LocalDate dataAbertura;
    private LocalDate dataFechamento;
    private String observacoesGerais;

    public Prontuario() {}

    public Prontuario(Integer id, Medico medico, User usuario, Paciente paciente,
                      LocalDate dataAbertura, LocalDate dataFechamento, String observacoesGerais) {
        this.id = id;
        this.medico = medico;
        this.usuario = usuario;
        this.paciente = paciente;
        this.dataAbertura = dataAbertura;
        this.dataFechamento = dataFechamento;
        this.observacoesGerais = observacoesGerais;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public LocalDate getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDate dataAbertura) { this.dataAbertura = dataAbertura; }
    public LocalDate getDataFechamento() { return dataFechamento; }
    public void setDataFechamento(LocalDate dataFechamento) { this.dataFechamento = dataFechamento; }
    public String getObservacoesGerais() { return observacoesGerais; }
    public void setObservacoesGerais(String observacoesGerais) { this.observacoesGerais = observacoesGerais; }
}
