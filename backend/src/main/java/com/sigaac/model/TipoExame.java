package com.sigaac.model;

import java.time.LocalDateTime;

public class TipoExame {

    private Integer id;
    private String nome;
    private String descricao;
    private LocalDateTime deletedAt;

    public TipoExame() {}

    public TipoExame(Integer id, String nome, String descricao, LocalDateTime deletedAt) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.deletedAt = deletedAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
