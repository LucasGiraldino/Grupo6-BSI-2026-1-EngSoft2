package com.sigaac.model;

import java.math.BigDecimal;

public class ItemCompraDTO {
    private Integer id;
    private Integer idAlimento;
    private String nomeAlimento;
    private BigDecimal quantidade;
    private BigDecimal preco;

    public ItemCompraDTO() {}
    public ItemCompraDTO(Integer id, Integer idAlimento, String nomeAlimento, BigDecimal quantidade, BigDecimal preco) {
        this.id = id;
        this.idAlimento = idAlimento;
        this.nomeAlimento = nomeAlimento;
        this.quantidade = quantidade;
        this.preco = preco;
    }
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getIdAlimento() { return idAlimento; }
    public void setIdAlimento(Integer idAlimento) { this.idAlimento = idAlimento; }
    public String getNomeAlimento() { return nomeAlimento; }
    public void setNomeAlimento(String nomeAlimento) { this.nomeAlimento = nomeAlimento; }
    public BigDecimal getQuantidade() { return quantidade; }
    public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
}
