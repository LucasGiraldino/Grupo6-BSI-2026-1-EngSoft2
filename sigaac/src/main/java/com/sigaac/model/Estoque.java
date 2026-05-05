package com.sigaac.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "estoque")
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estoque")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alimento", nullable = false, unique = true)
    private Alimento alimento;

    @Column(name = "quantidade_atual", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeAtual = BigDecimal.ZERO;

    @Column(name = "quantidade_minima", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeMinima = BigDecimal.ZERO;

    @Column(name = "data_ultima_atualizacao", nullable = false)
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
