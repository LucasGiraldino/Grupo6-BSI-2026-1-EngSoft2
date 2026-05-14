package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

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

    // -- Persistence --

    public static Optional<ItemCompra> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM itens_compra WHERE id_item_compra = ?",
            ItemCompra::mapRow, id);
    }

    public Alimento loadAlimento() {
        if (this.alimento != null && this.alimento.getId() != null) {
            this.alimento = Alimento.findById(this.alimento.getId()).orElse(null);
        }
        return this.alimento;
    }

    private static ItemCompra mapRow(ResultSet rs) throws SQLException {
        ItemCompra item = new ItemCompra();
        item.setId(rs.getInt("id_item_compra"));
        item.setQuantidade(rs.getBigDecimal("quantidade"));
        item.setPreco(rs.getBigDecimal("preco"));
        return item;
    }

    // -- Getters / Setters --

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
