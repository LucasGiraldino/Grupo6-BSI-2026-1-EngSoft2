package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    // -- Persistence --

    public static List<Compra> findAll() { return findAll(null, null, null); }

    public static List<Compra> findAll(String dataInicio, String dataFim, String observacoes) {
        var db = DatabaseHelper.getInstance();
        String sql = "SELECT * FROM compras WHERE 1=1";
        List<Object> params = new ArrayList<>();
        if (dataInicio != null && !dataInicio.isBlank()) {
            sql += " AND data_compra >= ?::timestamp";
            params.add(dataInicio);
        }
        if (dataFim != null && !dataFim.isBlank()) {
            sql += " AND data_compra <= ?::timestamp";
            params.add(dataFim);
        }
        if (observacoes != null && !observacoes.isBlank()) {
            sql += " AND observacoes ILIKE ?";
            params.add("%" + observacoes.trim() + "%");
        }
        sql += " ORDER BY id_compra";
        List<Compra> compras = db.queryList(sql, Compra::mapCompra, params.toArray());
        for (Compra c : compras) {
            c.setItens(findItensByCompraId(c.getId()));
        }
        return compras;
    }

    public static Optional<Compra> findById(Integer id) {
        var db = DatabaseHelper.getInstance();
        Optional<Compra> opt = db.querySingle(
            "SELECT * FROM compras WHERE id_compra = ?",
            Compra::mapCompra, id);
        opt.ifPresent(c -> c.setItens(findItensByCompraId(c.getId())));
        return opt;
    }

    private static List<ItemCompra> findItensByCompraId(Integer compraId) {
        return DatabaseHelper.getInstance().queryList(
            "SELECT * FROM itens_compra WHERE id_compra = ?",
            Compra::mapItemCompra, compraId);
    }

    public Compra save() {
        var db = DatabaseHelper.getInstance();
        if (this.dataCompra == null) {
            this.dataCompra = LocalDateTime.now();
        }
        db.executeInTransaction(conn -> {
            if (this.id == null) {
                Number id = db.executeInsert(
                    "INSERT INTO compras (data_compra, observacoes) VALUES (?, ?)",
                    this.dataCompra, this.observacoes);
                if (id != null) this.id = id.intValue();
            } else {
                db.executeUpdate(
                    "UPDATE compras SET data_compra = ?, observacoes = ? WHERE id_compra = ?",
                    this.dataCompra, this.observacoes, this.id);
            }

            if (this.itens != null) {
                for (ItemCompra item : this.itens) {
                    item.setCompra(this);
                    try (var stmt = conn.prepareStatement(
                            "INSERT INTO itens_compra (id_compra, id_alimento, quantidade, preco) VALUES (?, ?, ?, ?)",
                            Statement.RETURN_GENERATED_KEYS)) {
                        stmt.setInt(1, this.id);
                        stmt.setObject(2, item.getAlimento() != null ? item.getAlimento().getId() : null);
                        stmt.setBigDecimal(3, item.getQuantidade());
                        stmt.setBigDecimal(4, item.getPreco());
                        stmt.executeUpdate();
                    }
                }
            }
        });
        return this;
    }

    public void delete() {
        var db = DatabaseHelper.getInstance();
        db.executeUpdate("DELETE FROM itens_compra WHERE id_compra = ?", this.id);
        db.executeUpdate("DELETE FROM compras WHERE id_compra = ?", this.id);
    }

    // -- DTO-like helpers --

    public java.util.Map<String, Object> toResponseMap() {
        java.util.Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", this.id);
        map.put("dataCompra", this.dataCompra);
        map.put("observacoes", this.observacoes);
        if (this.itens != null) {
            map.put("itens", this.itens.stream().map(item -> {
                java.util.Map<String, Object> itemMap = new java.util.LinkedHashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("quantidade", item.getQuantidade());
                itemMap.put("preco", item.getPreco());
                if (item.getAlimento() != null) {
                    itemMap.put("idAlimento", item.getAlimento().getId());
                    itemMap.put("nomeAlimento", item.getAlimento().getNome());
                }
                return itemMap;
            }).collect(Collectors.toList()));
        }
        return map;
    }

    private static Compra mapCompra(ResultSet rs) throws SQLException {
        Compra c = new Compra();
        c.setId(rs.getInt("id_compra"));
        c.setDataCompra(rs.getObject("data_compra", LocalDateTime.class));
        c.setObservacoes(rs.getString("observacoes"));
        return c;
    }

    private static ItemCompra mapItemCompra(ResultSet rs) throws SQLException {
        ItemCompra item = new ItemCompra();
        item.setId(rs.getInt("id_item_compra"));
        item.setQuantidade(rs.getBigDecimal("quantidade"));
        item.setPreco(rs.getBigDecimal("preco"));
        return item;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public List<ItemCompra> getItens() { return itens; }
    public void setItens(List<ItemCompra> itens) { this.itens = itens; }
    public LocalDateTime getDataCompra() { return dataCompra; }
    public void setDataCompra(LocalDateTime dataCompra) { this.dataCompra = dataCompra; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
