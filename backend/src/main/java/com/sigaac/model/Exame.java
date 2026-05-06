package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exames")
public class Exame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exame")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prontuario", nullable = false)
    private Prontuario prontuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_exame", nullable = false)
    private TipoExame tipoExame;

    @Column(name = "justificativa_clinica", columnDefinition = "TEXT", nullable = false)
    private String justificativaClinica;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "observacoes_medico", columnDefinition = "TEXT")
    private String observacoesMedico;

    @Column(name = "data_realizacao")
    private LocalDate dataRealizacao;

    public Exame() {}

    public Exame(Integer id, Prontuario prontuario, Medico medico, TipoExame tipoExame,
                 String justificativaClinica, LocalDateTime dataSolicitacao, String status,
                 String observacoesMedico, LocalDate dataRealizacao) {
        this.id = id;
        this.prontuario = prontuario;
        this.medico = medico;
        this.tipoExame = tipoExame;
        this.justificativaClinica = justificativaClinica;
        this.dataSolicitacao = dataSolicitacao;
        this.status = status;
        this.observacoesMedico = observacoesMedico;
        this.dataRealizacao = dataRealizacao;
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
}
