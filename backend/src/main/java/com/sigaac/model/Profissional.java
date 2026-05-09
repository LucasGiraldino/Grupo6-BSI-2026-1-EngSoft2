package com.sigaac.model;

import java.time.LocalDate;

public class Profissional {

    private Integer id;
    private User usuario;
    private Endereco endereco;
    private String especialidade;
    private String registroProfissional;
    private LocalDate dataAdmissao;
    private LocalDate dataDemissao;

    public Profissional() {}

    public Profissional(Integer id, User usuario, Endereco endereco, String especialidade,
                        String registroProfissional, LocalDate dataAdmissao, LocalDate dataDemissao) {
        this.id = id;
        this.usuario = usuario;
        this.endereco = endereco;
        this.especialidade = especialidade;
        this.registroProfissional = registroProfissional;
        this.dataAdmissao = dataAdmissao;
        this.dataDemissao = dataDemissao;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    public String getRegistroProfissional() { return registroProfissional; }
    public void setRegistroProfissional(String registroProfissional) { this.registroProfissional = registroProfissional; }
    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }
    public LocalDate getDataDemissao() { return dataDemissao; }
    public void setDataDemissao(LocalDate dataDemissao) { this.dataDemissao = dataDemissao; }
}
