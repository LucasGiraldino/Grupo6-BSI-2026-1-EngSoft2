package com.sigaac.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "triagens")
public class Triagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_triagem")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prontuario", nullable = false)
    private Prontuario prontuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @Column(name = "data_triagem", nullable = false)
    private LocalDateTime dataTriagem;

    @Column(name = "pressao_arterial", length = 10)
    private String pressaoArterial;

    @Column(name = "febre", precision = 4, scale = 1)
    private BigDecimal febre;

    @Column(name = "condicao_clinica", columnDefinition = "TEXT", nullable = false)
    private String condicaoClinica;

    @Column(name = "condicao_nutricional", columnDefinition = "TEXT")
    private String condicaoNutricional;

    @Column(name = "condicao_social", columnDefinition = "TEXT")
    private String condicaoSocial;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    public Triagem() {}

    public Triagem(Integer id, Prontuario prontuario, Medico medico, LocalDateTime dataTriagem,
                   String pressaoArterial, BigDecimal febre, String condicaoClinica,
                   String condicaoNutricional, String condicaoSocial, String observacoes) {
        this.id = id;
        this.prontuario = prontuario;
        this.medico = medico;
        this.dataTriagem = dataTriagem;
        this.pressaoArterial = pressaoArterial;
        this.febre = febre;
        this.condicaoClinica = condicaoClinica;
        this.condicaoNutricional = condicaoNutricional;
        this.condicaoSocial = condicaoSocial;
        this.observacoes = observacoes;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }

    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }

    public LocalDateTime getDataTriagem() { return dataTriagem; }
    public void setDataTriagem(LocalDateTime dataTriagem) { this.dataTriagem = dataTriagem; }

    public String getPressaoArterial() { return pressaoArterial; }
    public void setPressaoArterial(String pressaoArterial) { this.pressaoArterial = pressaoArterial; }

    public BigDecimal getFebre() { return febre; }
    public void setFebre(BigDecimal febre) { this.febre = febre; }

    public String getCondicaoClinica() { return condicaoClinica; }
    public void setCondicaoClinica(String condicaoClinica) { this.condicaoClinica = condicaoClinica; }

    public String getCondicaoNutricional() { return condicaoNutricional; }
    public void setCondicaoNutricional(String condicaoNutricional) { this.condicaoNutricional = condicaoNutricional; }

    public String getCondicaoSocial() { return condicaoSocial; }
    public void setCondicaoSocial(String condicaoSocial) { this.condicaoSocial = condicaoSocial; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
