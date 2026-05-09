package com.sigaac.model;

import java.time.LocalDateTime;

public class ItemProntuario {

    private Integer id;
    private Prontuario prontuario;
    private String tipoItem;
    private String descricao;
    private LocalDateTime dataRegistro;
    private User usuario;

    public ItemProntuario() {}

    public ItemProntuario(Integer id, Prontuario prontuario, String tipoItem, String descricao,
                          LocalDateTime dataRegistro, User usuario) {
        this.id = id;
        this.prontuario = prontuario;
        this.tipoItem = tipoItem;
        this.descricao = descricao;
        this.dataRegistro = dataRegistro;
        this.usuario = usuario;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public String getTipoItem() { return tipoItem; }
    public void setTipoItem(String tipoItem) { this.tipoItem = tipoItem; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
}
