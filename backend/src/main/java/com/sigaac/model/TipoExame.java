package com.sigaac.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "tipos_exame")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}