package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Medico {

    private Integer id;
    private User usuario;
    private Endereco endereco;
    private String crm;
    private String especialidadeMedica;
    private LocalDate dataAdmissao;
    private LocalDateTime deletedAt;

    public Medico() {}

    public Medico(Integer id, User usuario, Endereco endereco, String crm,
                  String especialidadeMedica, LocalDate dataAdmissao, LocalDateTime deletedAt) {
        this.id = id;
        this.usuario = usuario;
        this.endereco = endereco;
        this.crm = crm;
        this.especialidadeMedica = especialidadeMedica;
        this.dataAdmissao = dataAdmissao;
        this.deletedAt = deletedAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }
    public String getEspecialidadeMedica() { return especialidadeMedica; }
    public void setEspecialidadeMedica(String especialidadeMedica) { this.especialidadeMedica = especialidadeMedica; }
    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
