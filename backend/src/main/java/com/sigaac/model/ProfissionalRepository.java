package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class ProfissionalRepository extends BaseRepository {

    public ProfissionalRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public Optional<Profissional> findById(Integer id) {
        return querySingle(
            "SELECT * FROM profissionais WHERE id_profissional = ?",
            this::mapRow, id);
    }

    private Profissional mapRow(ResultSet rs) throws SQLException {
        Profissional p = new Profissional();
        p.setId(rs.getInt("id_profissional"));
        p.setEspecialidade(rs.getString("especialidade"));
        p.setRegistroProfissional(rs.getString("registro_profissional"));
        p.setDataAdmissao(rs.getObject("data_admissao", java.time.LocalDate.class));
        p.setDataDemissao(rs.getObject("data_demissao", java.time.LocalDate.class));
        return p;
    }
}
