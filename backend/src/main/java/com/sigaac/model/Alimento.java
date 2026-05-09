package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Alimento {

    private Integer id;
    private CategoriaAlimento categoria;
    private String nome;
    private String descricao;
    private UnidadeMedida unidadeMedida;
    private LocalDate dataVencimento;
    private LocalDateTime deletedAt;

    public Alimento() {}

    public Alimento(Integer id, CategoriaAlimento categoria, String nome, String descricao,
                    UnidadeMedida unidadeMedida, LocalDate dataVencimento, LocalDateTime deletedAt) {
        this.id = id;
        this.categoria = categoria;
        this.nome = nome;
        this.descricao = descricao;
        this.unidadeMedida = unidadeMedida;
        this.dataVencimento = dataVencimento;
        this.deletedAt = deletedAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public CategoriaAlimento getCategoria() { return categoria; }
    public void setCategoria(CategoriaAlimento categoria) { this.categoria = categoria; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public UnidadeMedida getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(UnidadeMedida unidadeMedida) { this.unidadeMedida = unidadeMedida; }
    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
