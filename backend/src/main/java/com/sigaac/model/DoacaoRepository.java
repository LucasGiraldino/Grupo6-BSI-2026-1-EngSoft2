package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class DoacaoRepository extends BaseRepository {

    public DoacaoRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public Doacao save(Doacao doacao) {
        if (doacao.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO doacoes (id_profissional, id_paciente, data_doacao, observacoes) VALUES (?, ?, ?, ?)",
                doacao.getProfissional() != null ? doacao.getProfissional().getId() : null,
                doacao.getPaciente() != null ? doacao.getPaciente().getId() : null,
                doacao.getDataDoacao(), doacao.getObservacoes());
            if (id != null) doacao.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE doacoes SET id_profissional = ?, id_paciente = ?, data_doacao = ?, observacoes = ? WHERE id_doacao = ?",
                doacao.getProfissional() != null ? doacao.getProfissional().getId() : null,
                doacao.getPaciente() != null ? doacao.getPaciente().getId() : null,
                doacao.getDataDoacao(), doacao.getObservacoes(), doacao.getId());
        }
        return doacao;
    }
}
