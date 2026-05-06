package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evolucoes_clinicas")
public class EvolucaoClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evolucao")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prontuario", nullable = false)
    private Prontuario prontuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_profissional")
    private Profissional profissional;

    @Column(name = "data_registro", nullable = false)
    private LocalDateTime dataRegistro;

    @Column(name = "setor", length = 20, nullable = false)
    private String setor;

    @Column(name = "descricao", columnDefinition = "TEXT", nullable = false)
    private String descricao;

    public EvolucaoClinica() {}

    public EvolucaoClinica(Integer id, Prontuario prontuario, User usuario, Profissional profissional,
                           LocalDateTime dataRegistro, String setor, String descricao) {
        this.id = id;
        this.prontuario = prontuario;
        this.usuario = usuario;
        this.profissional = profissional;
        this.dataRegistro = dataRegistro;
        this.setor = setor;
        this.descricao = descricao;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }

    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }

    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }

    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }

    public String getSetor() { return setor; }
    public void setSetor(String setor) { this.setor = setor; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
