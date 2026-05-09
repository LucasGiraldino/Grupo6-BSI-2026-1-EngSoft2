package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Compra {

    private Integer id;
    private List<ItemCompra> itens = new ArrayList<>();
    private LocalDateTime dataCompra;
    private String observacoes;

    public Compra() {}

    public Compra(Integer id, List<ItemCompra> itens, LocalDateTime dataCompra, String observacoes) {
        this.id = id;
        this.itens = itens;
        this.dataCompra = dataCompra;
        this.observacoes = observacoes;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public List<ItemCompra> getItens() { return itens; }
    public void setItens(List<ItemCompra> itens) { this.itens = itens; }
    public LocalDateTime getDataCompra() { return dataCompra; }
    public void setDataCompra(LocalDateTime dataCompra) { this.dataCompra = dataCompra; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
