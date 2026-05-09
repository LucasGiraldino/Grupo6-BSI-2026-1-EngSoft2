package com.sigaac.model;

import java.math.BigDecimal;

public class ItemCompra {

    private Integer id;
    private Compra compra;
    private Alimento alimento;
    private BigDecimal quantidade;
    private BigDecimal preco;

    public ItemCompra() {}

    public ItemCompra(Integer id, Compra compra, Alimento alimento, BigDecimal quantidade, BigDecimal preco) {
        this.id = id;
        this.compra = compra;
        this.alimento = alimento;
        this.quantidade = quantidade;
        this.preco = preco;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Compra getCompra() { return compra; }
    public void setCompra(Compra compra) { this.compra = compra; }
    public Alimento getAlimento() { return alimento; }
    public void setAlimento(Alimento alimento) { this.alimento = alimento; }
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
}
