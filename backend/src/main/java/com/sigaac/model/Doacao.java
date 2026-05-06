package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "data_doacao", nullable = false)
    private LocalDateTime dataDoacao;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @OneToMany(mappedBy = "doacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemDoacao> itens = new ArrayList<>();

    public Doacao() {}

    public Doacao(Integer id, Profissional profissional, Paciente paciente, LocalDateTime dataDoacao, String observacoes, List<ItemDoacao> itens) {
        this.id = id;
        this.profissional = profissional;
        this.paciente = paciente;
        this.dataDoacao = dataDoacao;
        this.observacoes = observacoes;
        this.itens = itens;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profesional) { this.profissional = profesional; }

    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public LocalDateTime getDataDoacao() { return dataDoacao; }
    public void setDataDoacao(LocalDateTime dataDoacao) { this.dataDoacao = dataDoacao; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public List<ItemDoacao> getItens() { return itens; }
    public void setItens(List<ItemDoacao> itens) { this.itens = itens; }
}