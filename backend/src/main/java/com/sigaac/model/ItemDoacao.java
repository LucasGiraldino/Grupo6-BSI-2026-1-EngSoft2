package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class ItemDoacao {

    private Integer id;
    @com.fasterxml.jackson.annotation.JsonIgnore
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

    // -- Persistence --

    public static Optional<ItemDoacao> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM itens_doacao WHERE id_item_doacao = ?",
            ItemDoacao::mapRow, id);
    }

    public ItemDoacao save(Connection conn) throws SQLException {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO itens_doacao (id_doacao, id_alimento, quantidade, peso) VALUES (?, ?, ?, ?)",
                this.doacao != null ? this.doacao.getId() : null,
                this.alimento != null ? this.alimento.getId() : null,
                this.quantidade, this.peso);
            if (id != null) this.id = id.intValue();
        }
        return this;
    }

    public Alimento loadAlimento() {
        if (this.alimento != null && this.alimento.getId() != null) {
            this.alimento = Alimento.findById(this.alimento.getId()).orElse(null);
        }
        return this.alimento;
    }

    private static ItemDoacao mapRow(ResultSet rs) throws SQLException {
        ItemDoacao item = new ItemDoacao();
        item.setId(rs.getInt("id_item_doacao"));
        item.setQuantidade(rs.getBigDecimal("quantidade"));
        item.setPeso(rs.getBigDecimal("peso"));
        return item;
    }

    // -- Getters / Setters --

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
