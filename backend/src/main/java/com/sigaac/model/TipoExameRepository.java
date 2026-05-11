package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class TipoExameRepository extends BaseRepository {

    public TipoExameRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public List<TipoExame> findAll() {
        return queryList(
            "SELECT * FROM tipos_exame ORDER BY id_tipo_exame",
            this::mapRow);
    }

    public Optional<TipoExame> findById(Integer id) {
        return querySingle(
            "SELECT * FROM tipos_exame WHERE id_tipo_exame = ?",
            this::mapRow, id);
    }

    public TipoExame save(TipoExame tipo) {
        if (tipo.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO tipos_exame (nome, descricao, ativo) VALUES (?, ?, ?)",
                tipo.getNome(), tipo.getDescricao(), tipo.getAtivo() != null ? tipo.getAtivo() : true);
            if (id != null) tipo.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE tipos_exame SET nome = ?, descricao = ?, ativo = ? WHERE id_tipo_exame = ?",
                tipo.getNome(), tipo.getDescricao(), tipo.getAtivo(),
                tipo.getId());
        }
        return tipo;
    }

    public void delete(Integer id) {
        executeUpdate("DELETE FROM tipos_exame WHERE id_tipo_exame = ?", id);
    }

    private TipoExame mapRow(ResultSet rs) throws SQLException {
        TipoExame t = new TipoExame();
        t.setId(rs.getInt("id_tipo_exame"));
        t.setNome(rs.getString("nome"));
        t.setDescricao(rs.getString("descricao"));
        t.setAtivo(rs.getObject("ativo", Boolean.class));
        return t;
    }
}
