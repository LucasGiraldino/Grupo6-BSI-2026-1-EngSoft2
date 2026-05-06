package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doacoes")
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doacao")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_profissional", nullable = false)
    private Profissional profissional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estoque", nullable = false)
    private Estoque estoque;

    @Column(name = "data_doacao", nullable = false)
    private LocalDateTime dataDoacao;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    public Doacao() {}

    public Doacao(Integer id, Profissional profissional, Paciente paciente, Estoque estoque,
                  LocalDateTime dataDoacao, String observacoes) {
        this.id = id;
        this.profissional = profissional;
        this.paciente = paciente;
        this.estoque = estoque;
        this.dataDoacao = dataDoacao;
        this.observacoes = observacoes;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }

    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public Estoque getEstoque() { return estoque; }
    public void setEstoque(Estoque estoque) { this.estoque = estoque; }

    public LocalDateTime getDataDoacao() { return dataDoacao; }
    public void setDataDoacao(LocalDateTime dataDoacao) { this.dataDoacao = dataDoacao; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
