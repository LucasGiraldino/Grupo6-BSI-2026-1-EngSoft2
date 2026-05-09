package com.sigaac.model;

import java.sql.*;
import java.util.Optional;

public class ItemDoacaoRepository extends BaseRepository {

    public ItemDoacaoRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public ItemDoacao save(Connection conn, ItemDoacao item) throws SQLException {
        String sql = "INSERT INTO itens_doacao (id_doacao, id_alimento, quantidade, peso) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setObject(1, item.getDoacao() != null ? item.getDoacao().getId() : null);
            stmt.setObject(2, item.getAlimento() != null ? item.getAlimento().getId() : null);
            stmt.setBigDecimal(3, item.getQuantidade());
            stmt.setBigDecimal(4, item.getPeso());
            stmt.executeUpdate();
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) item.setId(rs.getInt(1));
        }
        return item;
    }
}
