package com.sigaac.model;

import java.time.LocalDateTime;

public class EvolucaoClinica {

    private Integer id;
    private Prontuario prontuario;
    private User usuario;
    private Profissional profissional;
    private LocalDateTime dataRegistro;
    private String setor;
    private String descricao;

    public EvolucaoClinica() {}

    public EvolucaoClinica(Integer id, Prontuario prontuario, User usuario, Profissional profissional,
                           LocalDateTime dataRegistro, String setor, String descricao) {
        this.id = id;
        this.prontuario = prontuario;
        this.usuario = usuario;
        this.profissional = profissional;
        this.dataRegistro = dataRegistro;
        this.setor = setor;
        this.descricao = descricao;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }
    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }
    public String getSetor() { return setor; }
    public void setSetor(String setor) { this.setor = setor; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
