package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "tipos_exame")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE tipos_exame SET deleted_at = NOW() WHERE id_tipo_exame = ?")
public class TipoExame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_exame")
    private Integer id;

    @Column(name = "nome", length = 150, nullable = false, unique = true)
    private String nome;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "deleted_at")
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
