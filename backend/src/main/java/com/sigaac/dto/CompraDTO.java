package com.sigaac.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CompraDTO {

    private Integer id;
    private LocalDateTime dataCompra;
    private String observacoes;
    private List<ItemCompraDTO> itens;

    public CompraDTO() {}

    public CompraDTO(Integer id, LocalDateTime dataCompra, String observacoes, List<ItemCompraDTO> itens) {
        this.id = id;
        this.dataCompra = dataCompra;
        this.observacoes = observacoes;
        this.itens = itens;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getDataCompra() { return dataCompra; }
    public void setDataCompra(LocalDateTime dataCompra) { this.dataCompra = dataCompra; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public List<ItemCompraDTO> getItens() { return itens; }
    public void setItens(List<ItemCompraDTO> itens) { this.itens = itens; }
}
