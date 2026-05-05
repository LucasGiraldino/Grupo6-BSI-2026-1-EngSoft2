package com.sigaac.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exames")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exame")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prontuario", nullable = false)
    private Prontuario prontuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_exame", nullable = false)
    private TipoExame tipoExame;

    @Column(name = "justificativa_clinica", columnDefinition = "TEXT", nullable = false)
    private String justificativaClinica;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "observacoes_medico", columnDefinition = "TEXT")
    private String observacoesMedico;

    @Column(name = "data_realizacao")
    private LocalDate dataRealizacao;
}