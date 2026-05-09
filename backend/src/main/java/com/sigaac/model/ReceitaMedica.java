package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReceitaMedica {

    private Integer id;
    private Prontuario prontuario;
    private Medico medico;
    private LocalDateTime dataEmissao;
    private String descricao;
    private LocalDate dataValidade;

    public ReceitaMedica() {}

    public ReceitaMedica(Integer id, Prontuario prontuario, Medico medico,
                         LocalDateTime dataEmissao, String descricao, LocalDate dataValidade) {
        this.id = id;
        this.prontuario = prontuario;
        this.medico = medico;
        this.dataEmissao = dataEmissao;
        this.descricao = descricao;
        this.dataValidade = dataValidade;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }
    public LocalDateTime getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDateTime dataEmissao) { this.dataEmissao = dataEmissao; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
}
