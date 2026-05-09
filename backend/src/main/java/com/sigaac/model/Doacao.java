package com.sigaac.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Doacao {

    private Integer id;
    private Profissional profissional;
    private Paciente paciente;
    private LocalDateTime dataDoacao;
    private String observacoes;
    private List<ItemDoacao> itens = new ArrayList<>();

    public Doacao() {}

    public Doacao(Integer id, Profissional profissional, Paciente paciente,
                  LocalDateTime dataDoacao, String observacoes, List<ItemDoacao> itens) {
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
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public LocalDateTime getDataDoacao() { return dataDoacao; }
    public void setDataDoacao(LocalDateTime dataDoacao) { this.dataDoacao = dataDoacao; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public List<ItemDoacao> getItens() { return itens; }
    public void setItens(List<ItemDoacao> itens) { this.itens = itens; }
}
