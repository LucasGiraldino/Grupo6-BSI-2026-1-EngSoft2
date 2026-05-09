package com.sigaac.model;

import java.math.BigDecimal;
import java.util.List;

public class DoacaoRequestDTO {
    private Integer idPaciente;
    private Integer idProfissional;
    private String observacoes;
    private List<ItemDoacaoRequestDTO> itens;

    public DoacaoRequestDTO() {}
    public DoacaoRequestDTO(Integer idPaciente, Integer idProfissional, String observacoes, List<ItemDoacaoRequestDTO> itens) {
        this.idPaciente = idPaciente;
        this.idProfissional = idProfissional;
        this.observacoes = observacoes;
        this.itens = itens;
    }
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    public Integer getIdProfissional() { return idProfissional; }
    public void setIdProfissional(Integer idProfissional) { this.idProfissional = idProfissional; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public List<ItemDoacaoRequestDTO> getItens() { return itens; }
    public void setItens(List<ItemDoacaoRequestDTO> itens) { this.itens = itens; }

    public static class ItemDoacaoRequestDTO {
        private Integer idAlimento;
        private BigDecimal quantidade;
        public ItemDoacaoRequestDTO() {}
        public ItemDoacaoRequestDTO(Integer idAlimento, BigDecimal quantidade) {
            this.idAlimento = idAlimento;
            this.quantidade = quantidade;
        }
        public Integer getIdAlimento() { return idAlimento; }
        public void setIdAlimento(Integer idAlimento) { this.idAlimento = idAlimento; }
        public BigDecimal getQuantidade() { return quantidade; }
        public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
    }
}
