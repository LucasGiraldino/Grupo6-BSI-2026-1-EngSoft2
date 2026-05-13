package com.sigaac.model;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CompraRepository extends BaseRepository {

    public CompraRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public List<Compra> findAll() {
        return findAll(null, null, null);
    }

    public List<Compra> findAll(String dataInicio, String dataFim, String observacoes) {
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
        List<Compra> compras = queryList(sql, this::mapCompra, params.toArray());
        for (Compra c : compras) {
            c.setItens(findItensByCompraId(c.getId()));
        }
        return compras;
    }

    public Optional<Compra> findById(Integer id) {
        Optional<Compra> opt = querySingle(
            "SELECT * FROM compras WHERE id_compra = ?",
            this::mapCompra, id);
        opt.ifPresent(c -> c.setItens(findItensByCompraId(c.getId())));
        return opt;
    }

    public Compra save(Compra compra) {
        if (compra.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO compras (data_compra, observacoes) VALUES (?, ?)",
                compra.getDataCompra(), compra.getObservacoes());
            if (id != null) compra.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE compras SET data_compra = ?, observacoes = ? WHERE id_compra = ?",
                compra.getDataCompra(), compra.getObservacoes(), compra.getId());
        }
        return compra;
    }

    public void deleteById(Integer id) {
        executeUpdate("DELETE FROM itens_compra WHERE id_compra = ?", id);
        executeUpdate("DELETE FROM compras WHERE id_compra = ?", id);
    }

    public void saveItem(Connection conn, ItemCompra item) throws SQLException {
        String sql = "INSERT INTO itens_compra (id_compra, id_alimento, quantidade, preco) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setObject(1, item.getCompra() != null ? item.getCompra().getId() : null);
            stmt.setObject(2, item.getAlimento() != null ? item.getAlimento().getId() : null);
            stmt.setBigDecimal(3, item.getQuantidade());
            stmt.setBigDecimal(4, item.getPreco());
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) item.setId(rs.getInt(1));
        }
    }

    private List<ItemCompra> findItensByCompraId(Integer compraId) {
        return queryList(
            "SELECT * FROM itens_compra WHERE id_compra = ?",
            this::mapItemCompra, compraId);
    }

    private Compra mapCompra(ResultSet rs) throws SQLException {
        Compra c = new Compra();
        c.setId(rs.getInt("id_compra"));
        c.setDataCompra(rs.getObject("data_compra", java.time.LocalDateTime.class));
        c.setObservacoes(rs.getString("observacoes"));
        return c;
    }

    private ItemCompra mapItemCompra(ResultSet rs) throws SQLException {
        ItemCompra item = new ItemCompra();
        item.setId(rs.getInt("id_item_compra"));
        item.setQuantidade(rs.getBigDecimal("quantidade"));
        item.setPreco(rs.getBigDecimal("preco"));
        return item;
    }
}
