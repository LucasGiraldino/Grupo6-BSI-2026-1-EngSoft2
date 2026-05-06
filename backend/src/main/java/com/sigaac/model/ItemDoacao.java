package com.sigaac.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "itens_doacao")
public class ItemDoacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item_doacao")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_doacao", nullable = false)
    private Doacao doacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alimento", nullable = false)
    private Alimento alimento;

    @Column(name = "quantidade", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidade;

    @Column(name = "peso", precision = 10, scale = 3)
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
