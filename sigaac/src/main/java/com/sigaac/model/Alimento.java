package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "alimentos")
public class Alimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alimento")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaAlimento categoria;

    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "unidade_medida", length = 20, nullable = false)
    private String unidadeMedida;

    @Column(name = "data_vencimento")
    private LocalDate dataVencimento;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    public Alimento() {}

    public Alimento(Integer id, CategoriaAlimento categoria, String nome, String descricao, String unidadeMedida, LocalDate dataVencimento, Boolean ativo) {
        this.id = id;
        this.categoria = categoria;
        this.nome = nome;
        this.descricao = descricao;
        this.unidadeMedida = unidadeMedida;
        this.dataVencimento = dataVencimento;
        this.ativo = ativo;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public CategoriaAlimento getCategoria() { return categoria; }
    public void setCategoria(CategoriaAlimento categoria) { this.categoria = categoria; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }

    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
