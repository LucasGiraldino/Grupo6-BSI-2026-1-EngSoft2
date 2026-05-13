package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class ProntuarioRepository extends BaseRepository {

    public ProntuarioRepository(com.zaxxer.hikari.HikariDataSource ds) { super(ds); }

    public List<Prontuario> findAll() {
        return queryList(
            "SELECT p.*, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente " +
            "WHERE p.data_fechamento IS NULL " +
            "ORDER BY pac.nome",
            this::mapRow);
    }

    public Optional<Prontuario> findById(Integer id) {
        return querySingle(
            "SELECT p.*, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente " +
            "WHERE p.id_prontuario = ?",
            this::mapRow, id);
    }

    public Prontuario save(Prontuario prontuario) {
        if (prontuario.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO prontuarios (id_medico, id_usuario, id_paciente, data_abertura, observacoes_gerais) VALUES (?, ?, ?, ?, ?)",
                prontuario.getMedico() != null ? prontuario.getMedico().getId() : null,
                prontuario.getUsuario() != null ? prontuario.getUsuario().getId() : null,
                prontuario.getPaciente() != null ? prontuario.getPaciente().getId() : null,
                prontuario.getDataAbertura(), prontuario.getObservacoesGerais());
            if (id != null) prontuario.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE prontuarios SET id_medico = ?, id_usuario = ?, id_paciente = ?, data_abertura = ?, data_fechamento = ?, observacoes_gerais = ? WHERE id_prontuario = ?",
                prontuario.getMedico() != null ? prontuario.getMedico().getId() : null,
                prontuario.getUsuario() != null ? prontuario.getUsuario().getId() : null,
                prontuario.getPaciente() != null ? prontuario.getPaciente().getId() : null,
                prontuario.getDataAbertura(), prontuario.getDataFechamento(),
                prontuario.getObservacoesGerais(), prontuario.getId());
        }
        return prontuario;
    }

    public List<Prontuario> searchProntuarios(String query) {
        String sql = "SELECT p.*, pac.id_paciente, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente WHERE p.data_fechamento IS NULL";
        if (query != null && !query.isBlank()) {
            String pattern = "%" + query.trim() + "%";
            sql += " AND (pac.nome ILIKE ? OR pac.cpf ILIKE ? OR CAST(p.id_prontuario AS TEXT) ILIKE ?)";
            return queryList(sql + " ORDER BY pac.nome LIMIT 20", this::mapRow, pattern, pattern, pattern);
        }
        return queryList(sql + " ORDER BY pac.nome LIMIT 20", this::mapRow);
    }

    private Prontuario mapRow(ResultSet rs) throws SQLException {
        Prontuario p = new Prontuario();
        p.setId(rs.getInt("id_prontuario"));
        p.setDataAbertura(rs.getObject("data_abertura", LocalDate.class));
        p.setDataFechamento(rs.getObject("data_fechamento", LocalDate.class));
        p.setObservacoesGerais(rs.getString("observacoes_gerais"));
        Paciente pac = new Paciente();
        pac.setId(rs.getObject("id_paciente", Integer.class));
        pac.setNome(rs.getString("paciente_nome"));
        pac.setCpf(rs.getString("paciente_cpf"));
        p.setPaciente(pac);
        return p;
    }
}
