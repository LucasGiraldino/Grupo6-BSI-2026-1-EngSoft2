package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class MedicoRepository extends BaseRepository {

    public MedicoRepository(com.zaxxer.hikari.HikariDataSource ds) { super(ds); }

    public List<Medico> findAll() {
        return queryList(
            "SELECT m.*, u.nome AS usuario_nome, u.email AS usuario_email FROM medicos m " +
            "JOIN users u ON m.id_usuario = u.id_usuario " +
            "WHERE m.deleted_at IS NULL ORDER BY u.nome",
            this::mapRow);
    }

    public Optional<Medico> findById(Integer id) {
        return querySingle(
            "SELECT m.*, u.nome AS usuario_nome, u.email AS usuario_email FROM medicos m " +
            "JOIN users u ON m.id_usuario = u.id_usuario " +
            "WHERE m.id_medico = ? AND m.deleted_at IS NULL",
            this::mapRow, id);
    }

    public Medico save(Medico medico) {
        if (medico.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO medicos (id_usuario, id_endereco, especialidade_medica, crm, data_admissao, ativo) VALUES (?, ?, ?, ?, ?, ?)",
                medico.getUsuario() != null ? medico.getUsuario().getId() : null,
                medico.getEndereco() != null ? medico.getEndereco().getId() : null,
                medico.getEspecialidadeMedica(), medico.getCrm(), medico.getDataAdmissao(), true);
            if (id != null) medico.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE medicos SET id_usuario = ?, id_endereco = ?, especialidade_medica = ?, crm = ?, data_admissao = ?, ativo = ? WHERE id_medico = ?",
                medico.getUsuario() != null ? medico.getUsuario().getId() : null,
                medico.getEndereco() != null ? medico.getEndereco().getId() : null,
                medico.getEspecialidadeMedica(), medico.getCrm(), medico.getDataAdmissao(), true,
                medico.getId());
        }
        return medico;
    }

    private Medico mapRow(ResultSet rs) throws SQLException {
        Medico m = new Medico();
        m.setId(rs.getInt("id_medico"));
        m.setCrm(rs.getString("crm"));
        m.setEspecialidadeMedica(rs.getString("especialidade_medica"));
        m.setDataAdmissao(rs.getObject("data_admissao", LocalDate.class));
        m.setDeletedAt(rs.getObject("deleted_at", java.time.LocalDateTime.class));
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        u.setNome(rs.getString("usuario_nome"));
        u.setEmail(rs.getString("usuario_email"));
        m.setUsuario(u);
        return m;
    }
}
