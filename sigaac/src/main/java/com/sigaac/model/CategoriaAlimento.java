package com.sigaac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias_alimentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaAlimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer id;

    @Column(name = "nome", length = 100, nullable = false, unique = true)
    private String nome;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;
}