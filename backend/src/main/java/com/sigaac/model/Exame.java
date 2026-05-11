package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Exame {

    private Integer id;
    private Prontuario prontuario;
    private Medico medico;
    private TipoExame tipoExame;
    private String justificativaClinica;
    private LocalDateTime dataSolicitacao;
    private String status;
    private String observacoesMedico;
    private LocalDate dataRealizacao;
    private LocalDateTime deletedAt;

    public Exame() {}

    public Exame(Integer id, Prontuario prontuario, Medico medico, TipoExame tipoExame,
                 String justificativaClinica, LocalDateTime dataSolicitacao, String status,
                 String observacoesMedico, LocalDate dataRealizacao, LocalDateTime deletedAt) {
        this.id = id;
        this.prontuario = prontuario;
        this.medico = medico;
        this.tipoExame = tipoExame;
        this.justificativaClinica = justificativaClinica;
        this.dataSolicitacao = dataSolicitacao;
        this.status = status;
        this.observacoesMedico = observacoesMedico;
        this.dataRealizacao = dataRealizacao;
        this.deletedAt = deletedAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }
    public TipoExame getTipoExame() { return tipoExame; }
    public void setTipoExame(TipoExame tipoExame) { this.tipoExame = tipoExame; }
    public String getJustificativaClinica() { return justificativaClinica; }
    public void setJustificativaClinica(String justificativaClinica) { this.justificativaClinica = justificativaClinica; }
    public LocalDateTime getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(LocalDateTime dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getObservacoesMedico() { return observacoesMedico; }
    public void setObservacoesMedico(String observacoesMedico) { this.observacoesMedico = observacoesMedico; }
    public LocalDate getDataRealizacao() { return dataRealizacao; }
    public void setDataRealizacao(LocalDate dataRealizacao) { this.dataRealizacao = dataRealizacao; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
