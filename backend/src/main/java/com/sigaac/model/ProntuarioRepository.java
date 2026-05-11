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
        Number id = executeInsert(
            "INSERT INTO prontuarios (id_medico, id_usuario, id_paciente, data_abertura) VALUES (?, ?, ?, ?)",
            prontuario.getMedico() != null ? prontuario.getMedico().getId() : null,
            prontuario.getUsuario() != null ? prontuario.getUsuario().getId() : null,
            prontuario.getPaciente() != null ? prontuario.getPaciente().getId() : null,
            prontuario.getDataAbertura());
        if (id != null) prontuario.setId(id.intValue());
        return prontuario;
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
