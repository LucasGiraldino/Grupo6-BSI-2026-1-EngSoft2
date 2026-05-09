package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class EstoqueRepository extends BaseRepository {

    public EstoqueRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public Optional<Estoque> findByAlimentoId(Integer idAlimento) {
        return querySingle(
            "SELECT * FROM estoque WHERE id_alimento = ?",
            this::mapRow, idAlimento);
    }

    public Optional<Estoque> findById(Integer id) {
        return querySingle(
            "SELECT * FROM estoque WHERE id_estoque = ?",
            this::mapRow, id);
    }

    public Estoque save(Estoque estoque) {
        if (estoque.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO estoque (id_alimento, quantidade_atual, quantidade_minima, data_ultima_atualizacao) VALUES (?, ?, ?, ?)",
                estoque.getAlimento() != null ? estoque.getAlimento().getId() : null,
                estoque.getQuantidadeAtual(), estoque.getQuantidadeMinima(),
                estoque.getDataUltimaAtualizacao());
            if (id != null) estoque.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE estoque SET quantidade_atual = ?, quantidade_minima = ?, data_ultima_atualizacao = ? WHERE id_estoque = ?",
                estoque.getQuantidadeAtual(), estoque.getQuantidadeMinima(),
                estoque.getDataUltimaAtualizacao(), estoque.getId());
        }
        return estoque;
    }

    private Estoque mapRow(ResultSet rs) throws SQLException {
        Estoque e = new Estoque();
        e.setId(rs.getInt("id_estoque"));
        e.setQuantidadeAtual(rs.getBigDecimal("quantidade_atual"));
        e.setQuantidadeMinima(rs.getBigDecimal("quantidade_minima"));
        e.setDataUltimaAtualizacao(rs.getObject("data_ultima_atualizacao", java.time.LocalDateTime.class));
        return e;
    }
}
