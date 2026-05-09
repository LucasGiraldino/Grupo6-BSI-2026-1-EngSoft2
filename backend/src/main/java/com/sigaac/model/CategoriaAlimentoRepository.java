package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class CategoriaAlimentoRepository extends BaseRepository {

    public CategoriaAlimentoRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public List<CategoriaAlimento> findAll() {
        return queryList(
            "SELECT * FROM categorias_alimentos ORDER BY id_categoria",
            this::mapRow);
    }

    public Optional<CategoriaAlimento> findById(Integer id) {
        return querySingle(
            "SELECT * FROM categorias_alimentos WHERE id_categoria = ?",
            this::mapRow, id);
    }

    public boolean existsById(Integer id) {
        return querySingle(
            "SELECT 1 FROM categorias_alimentos WHERE id_categoria = ?",
            rs -> true, id).orElse(false);
    }

    public CategoriaAlimento save(CategoriaAlimento cat) {
        if (cat.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO categorias_alimentos (nome, descricao) VALUES (?, ?)",
                cat.getNome(), cat.getDescricao());
            if (id != null) cat.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE categorias_alimentos SET nome = ?, descricao = ? WHERE id_categoria = ?",
                cat.getNome(), cat.getDescricao(), cat.getId());
        }
        return cat;
    }

    public void deleteById(Integer id) {
        executeUpdate("DELETE FROM categorias_alimentos WHERE id_categoria = ?", id);
    }

    private CategoriaAlimento mapRow(ResultSet rs) throws SQLException {
        CategoriaAlimento c = new CategoriaAlimento();
        c.setId(rs.getInt("id_categoria"));
        c.setNome(rs.getString("nome"));
        c.setDescricao(rs.getString("descricao"));
        return c;
    }
}
