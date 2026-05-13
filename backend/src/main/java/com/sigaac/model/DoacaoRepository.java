package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class DoacaoRepository extends BaseRepository {

    private final ProfissionalRepository profissionalRepo;
    private final PacienteRepository pacienteRepo;

    public DoacaoRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
        this.profissionalRepo = new ProfissionalRepository(ds);
        this.pacienteRepo = new PacienteRepository(ds);
    }

    public List<Doacao> findAll() {
        return queryList("SELECT * FROM doacoes ORDER BY data_doacao DESC", this::mapRow);
    }

    public Optional<Doacao> findById(Integer id) {
        return querySingle("SELECT * FROM doacoes WHERE id_doacao = ?", this::mapRow, id);
    }

    public void deleteById(Integer id) {
        executeUpdate("DELETE FROM doacoes WHERE id_doacao = ?", id);
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

    private Doacao mapRow(ResultSet rs) throws SQLException {
        Doacao d = new Doacao();
        d.setId(rs.getInt("id_doacao"));
        Integer idProf = rs.getObject("id_profissional", Integer.class);
        if (idProf != null) d.setProfissional(profissionalRepo.findById(idProf).orElse(null));
        Integer idPac = rs.getObject("id_paciente", Integer.class);
        if (idPac != null) d.setPaciente(pacienteRepo.findById(idPac).orElse(null));
        d.setDataDoacao(rs.getObject("data_doacao", java.time.LocalDateTime.class));
        d.setObservacoes(rs.getString("observacoes"));
        return d;
    }
}
