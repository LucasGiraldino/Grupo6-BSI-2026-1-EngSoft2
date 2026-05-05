package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "alimentos")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE alimentos SET deleted_at = NOW() WHERE id_alimento = ?")
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

    @Enumerated(EnumType.STRING)
    @Column(name = "unidade_medida", nullable = false)
    private UnidadeMedida unidadeMedida;

    @Column(name = "data_vencimento")
    private LocalDate dataVencimento;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Alimento() {}

    public Alimento(Integer id, CategoriaAlimento categoria, String nome, String descricao, UnidadeMedida unidadeMedida, LocalDate dataVencimento, LocalDateTime deletedAt) {
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
