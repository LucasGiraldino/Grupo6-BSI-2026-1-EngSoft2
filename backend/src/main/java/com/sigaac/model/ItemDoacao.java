package com.sigaac.model;

import java.math.BigDecimal;

public class ItemDoacao {

    private Integer id;
    private Doacao doacao;
    private Alimento alimento;
    private BigDecimal quantidade;
    private BigDecimal peso;

    public ItemDoacao() {}

    public ItemDoacao(Integer id, Doacao doacao, Alimento alimento, BigDecimal quantidade, BigDecimal peso) {
        this.id = id;
        this.doacao = doacao;
        this.alimento = alimento;
        this.quantidade = quantidade;
        this.peso = peso;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Doacao getDoacao() { return doacao; }
    public void setDoacao(Doacao doacao) { this.doacao = doacao; }
    public Alimento getAlimento() { return alimento; }
    public void setAlimento(Alimento alimento) { this.alimento = alimento; }
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    public BigDecimal getPeso() { return peso; }
    public void setPeso(BigDecimal peso) { this.peso = peso; }
}
