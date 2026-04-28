package com.sigaac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipos_exame")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoExame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_exame")
    private Integer id;

    @Column(name = "nome", length = 150, nullable = false, unique = true)
    private String nome;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private Boolean ativo = true;
}