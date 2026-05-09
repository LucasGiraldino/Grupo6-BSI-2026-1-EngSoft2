package com.sigaac.model;

import java.time.LocalDateTime;

public class Notificacao {

    private Integer id;
    private Paciente paciente;
    private String tipo;
    private String mensagem;
    private LocalDateTime dataEnvio;
    private String statusEnvio;

    public Notificacao() {}

    public Notificacao(Integer id, Paciente paciente, String tipo, String mensagem,
                       LocalDateTime dataEnvio, String statusEnvio) {
        this.id = id;
        this.paciente = paciente;
        this.tipo = tipo;
        this.mensagem = mensagem;
        this.dataEnvio = dataEnvio;
        this.statusEnvio = statusEnvio;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }
    public String getStatusEnvio() { return statusEnvio; }
    public void setStatusEnvio(String statusEnvio) { this.statusEnvio = statusEnvio; }
}
