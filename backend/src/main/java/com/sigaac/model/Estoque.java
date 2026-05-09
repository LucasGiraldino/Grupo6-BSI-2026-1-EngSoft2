package com.sigaac.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Estoque {

    private Integer id;
    private Alimento alimento;
    private BigDecimal quantidadeAtual = BigDecimal.ZERO;
    private BigDecimal quantidadeMinima = BigDecimal.ZERO;
    private LocalDateTime dataUltimaAtualizacao;

    public Estoque() {}

    public Estoque(Integer id, Alimento alimento, BigDecimal quantidadeAtual, BigDecimal quantidadeMinima, LocalDateTime dataUltimaAtualizacao) {
        this.id = id;
        this.alimento = alimento;
        this.quantidadeAtual = quantidadeAtual;
        this.quantidadeMinima = quantidadeMinima;
        this.dataUltimaAtualizacao = dataUltimaAtualizacao;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Alimento getAlimento() { return alimento; }
    public void setAlimento(Alimento alimento) { this.alimento = alimento; }
    public BigDecimal getQuantidadeAtual() { return quantidadeAtual; }
    public void setQuantidadeAtual(BigDecimal quantidadeAtual) { this.quantidadeAtual = quantidadeAtual; }
    public BigDecimal getQuantidadeMinima() { return quantidadeMinima; }
    public void setQuantidadeMinima(BigDecimal quantidadeMinima) { this.quantidadeMinima = quantidadeMinima; }
    public LocalDateTime getDataUltimaAtualizacao() { return dataUltimaAtualizacao; }
    public void setDataUltimaAtualizacao(LocalDateTime dataUltimaAtualizacao) { this.dataUltimaAtualizacao = dataUltimaAtualizacao; }
}
