package com.sigaac.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "triagens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Triagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_triagem")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prontuario", nullable = false)
    private Prontuario prontuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @Column(name = "data_triagem", nullable = false)
    private LocalDateTime dataTriagem;

    @Column(name = "pressao_arterial", length = 10)
    private String pressaoArterial;

    @Column(name = "febre", precision = 4, scale = 1)
    private BigDecimal febre;

    @Column(name = "condicao_clinica", columnDefinition = "TEXT", nullable = false)
    private String condicaoClinica;

    @Column(name = "condicao_nutricional", columnDefinition = "TEXT")
    private String condicaoNutricional;

    @Column(name = "condicao_social", columnDefinition = "TEXT")
    private String condicaoSocial;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;
}