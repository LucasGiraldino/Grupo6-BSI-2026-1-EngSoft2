package com.sigaac.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "parametrizacao_ong")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParametrizacaoOng {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_parametrizacao")
    private Integer id;

    @Column(name = "razao_social", length = 150, nullable = false)
    private String razaoSocial;

    @Column(name = "nome_fantasia", length = 150)
    private String nomeFantasia;

    @Column(name = "cnpj", length = 14, nullable = false, unique = true)
    private String cnpj;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "site", length = 150)
    private String site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_endereco")
    private Endereco endereco;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "data_fundacao")
    private LocalDate dataFundacao;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;
}