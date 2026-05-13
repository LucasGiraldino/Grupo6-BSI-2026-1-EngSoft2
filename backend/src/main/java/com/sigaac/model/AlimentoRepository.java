package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class AlimentoRepository extends BaseRepository {

    public AlimentoRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public List<Alimento> findAll() {
        return findAll(null, null);
    }

    public List<Alimento> findAll(String nome, Integer categoriaId) {
        String sql = "SELECT * FROM alimentos WHERE deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (nome != null && !nome.isBlank()) {
            sql += " AND nome ILIKE ?";
            params.add("%" + nome.trim() + "%");
        }
        if (categoriaId != null) {
            sql += " AND id_categoria = ?";
            params.add(categoriaId);
        }
        sql += " ORDER BY id_alimento";
        return queryList(sql, this::mapRow, params.toArray());
    }

    public Optional<Alimento> findById(Integer id) {
        return querySingle(
            "SELECT * FROM alimentos WHERE id_alimento = ? AND deleted_at IS NULL",
            this::mapRow, id);
    }

    public boolean existsById(Integer id) {
        return querySingle(
            "SELECT 1 FROM alimentos WHERE id_alimento = ? AND deleted_at IS NULL",
            rs -> true, id).orElse(false);
    }

    public Alimento save(Alimento alimento) {
        if (alimento.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO alimentos (id_categoria, nome, descricao, unidade_medida, data_vencimento) VALUES (?, ?, ?, ?, ?)",
                alimento.getCategoria() != null ? alimento.getCategoria().getId() : null,
                alimento.getNome(), alimento.getDescricao(),
                alimento.getUnidadeMedida() != null ? alimento.getUnidadeMedida().name() : null,
                alimento.getDataVencimento());
            if (id != null) alimento.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE alimentos SET id_categoria = ?, nome = ?, descricao = ?, unidade_medida = ?, data_vencimento = ? WHERE id_alimento = ?",
                alimento.getCategoria() != null ? alimento.getCategoria().getId() : null,
                alimento.getNome(), alimento.getDescricao(),
                alimento.getUnidadeMedida() != null ? alimento.getUnidadeMedida().name() : null,
                alimento.getDataVencimento(), alimento.getId());
        }
        return alimento;
    }

    public void deleteById(Integer id) {
        executeUpdate("UPDATE alimentos SET deleted_at = NOW() WHERE id_alimento = ?", id);
    }

    private Alimento mapRow(ResultSet rs) throws SQLException {
        Alimento a = new Alimento();
        a.setId(rs.getInt("id_alimento"));
        a.setNome(rs.getString("nome"));
        a.setDescricao(rs.getString("descricao"));
        String unidade = rs.getString("unidade_medida");
        if (unidade != null) {
            try { a.setUnidadeMedida(UnidadeMedida.valueOf(unidade)); } catch (IllegalArgumentException e) {}
        }
        a.setDataVencimento(rs.getObject("data_vencimento", java.time.LocalDate.class));
        a.setDeletedAt(rs.getObject("deleted_at", java.time.LocalDateTime.class));
        return a;
    }
}
