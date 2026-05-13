package com.sigaac.model;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public class ConsultaRepository extends BaseRepository {

    public ConsultaRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public List<Consulta> findAll() {
        return findAll(null);
    }

    public List<Consulta> findAll(String status) {
        String sql = "SELECT c.*, p.id_paciente, p.nome AS p_nome, p.cpf AS p_cpf, " +
            "a.id_agenda, a.data AS a_data, a.hora_inicio, a.hora_fim, " +
            "pr.id_profissional, u.nome AS prof_nome " +
            "FROM consultas c " +
            "JOIN pacientes p ON p.id_paciente = c.id_paciente " +
            "LEFT JOIN agenda a ON a.id_agenda = c.id_agenda " +
            "LEFT JOIN profissionais pr ON pr.id_profissional = c.id_profissional " +
            "LEFT JOIN users u ON u.id_usuario = pr.id_usuario";
        if (status != null && !status.isBlank()) {
            sql += " WHERE c.status = ?";
            return queryList(sql + " ORDER BY c.data_agendamento DESC", this::mapRow, status);
        }
        return queryList(sql + " ORDER BY c.data_agendamento DESC", this::mapRow);
    }

    public List<Consulta> findByAgendaPeriodo(Integer profissional, String dataInicio, String dataFim) {
        String sql = "SELECT c.*, p.id_paciente, p.nome AS p_nome, p.cpf AS p_cpf, " +
            "a.id_agenda, a.data AS a_data, a.hora_inicio, a.hora_fim, " +
            "pr.id_profissional, u.nome AS prof_nome " +
            "FROM consultas c " +
            "JOIN pacientes p ON p.id_paciente = c.id_paciente " +
            "LEFT JOIN agenda a ON a.id_agenda = c.id_agenda " +
            "LEFT JOIN profissionais pr ON pr.id_profissional = c.id_profissional " +
            "LEFT JOIN users u ON u.id_usuario = pr.id_usuario WHERE 1=1";
        java.util.List<Object> params = new java.util.ArrayList<>();
        if (profissional != null) {
            sql += " AND c.id_profissional = ?";
            params.add(profissional);
        }
        if (dataInicio != null && !dataInicio.isBlank()) {
            sql += " AND a.data >= ?::date";
            params.add(java.sql.Date.valueOf(LocalDate.parse(dataInicio)));
        }
        if (dataFim != null && !dataFim.isBlank()) {
            sql += " AND a.data <= ?::date";
            params.add(java.sql.Date.valueOf(LocalDate.parse(dataFim)));
        }
        sql += " ORDER BY a.data, a.hora_inicio";
        return queryList(sql, this::mapRow, params.toArray());
    }

    public Optional<Consulta> findById(Integer id) {
        return querySingle(
            "SELECT c.*, p.id_paciente, p.nome AS p_nome, p.cpf AS p_cpf, " +
            "a.id_agenda, a.data AS a_data, a.hora_inicio, a.hora_fim, " +
            "pr.id_profissional, u.nome AS prof_nome " +
            "FROM consultas c " +
            "JOIN pacientes p ON p.id_paciente = c.id_paciente " +
            "LEFT JOIN agenda a ON a.id_agenda = c.id_agenda " +
            "LEFT JOIN profissionais pr ON pr.id_profissional = c.id_profissional " +
            "LEFT JOIN users u ON u.id_usuario = pr.id_usuario " +
            "WHERE c.id_consulta = ?", this::mapRow, id);
    }

    public Consulta save(Consulta consulta) {
        if (consulta.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO consultas (id_paciente, id_agenda, id_profissional, tipo_consulta, status, observacoes, data_agendamento) VALUES (?, ?, ?, ?, ?, ?, ?)",
                consulta.getPaciente() != null ? consulta.getPaciente().getId() : null,
                consulta.getAgenda() != null ? consulta.getAgenda().getId() : null,
                consulta.getProfissional() != null ? consulta.getProfissional().getId() : null,
                consulta.getTipoConsulta(), consulta.getStatus(),
                consulta.getObservacoes(), consulta.getDataAgendamento());
            if (id != null) consulta.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE consultas SET id_paciente = ?, id_agenda = ?, id_profissional = ?, tipo_consulta = ?, status = ?, observacoes = ? WHERE id_consulta = ?",
                consulta.getPaciente() != null ? consulta.getPaciente().getId() : null,
                consulta.getAgenda() != null ? consulta.getAgenda().getId() : null,
                consulta.getProfissional() != null ? consulta.getProfissional().getId() : null,
                consulta.getTipoConsulta(), consulta.getStatus(),
                consulta.getObservacoes(), consulta.getId());
        }
        return consulta;
    }

    public void cancelar(Connection conn, Integer id, LocalDateTime dataCancelamento) {
        try (var stmt = conn.prepareStatement(
            "UPDATE consultas SET status = 'CANCELADA', data_cancelamento = ? WHERE id_consulta = ?")) {
            stmt.setObject(1, dataCancelamento);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public Optional<Integer> findIdAgendaById(Connection conn, Integer id) {
        try (var stmt = conn.prepareStatement("SELECT id_agenda FROM consultas WHERE id_consulta = ?")) {
            stmt.setInt(1, id);
            var rs = stmt.executeQuery();
            if (rs.next()) {
                return Optional.ofNullable(rs.getObject("id_agenda", Integer.class));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return Optional.empty();
    }

    private Consulta mapRow(ResultSet rs) throws SQLException {
        Consulta c = new Consulta();
        c.setId(rs.getInt("id_consulta"));
        c.setTipoConsulta(rs.getString("tipo_consulta"));
        c.setStatus(rs.getString("status"));
        c.setObservacoes(rs.getString("observacoes"));
        c.setDataAgendamento(rs.getObject("data_agendamento", LocalDateTime.class));
        c.setDataCancelamento(rs.getObject("data_cancelamento", LocalDateTime.class));

        Paciente p = new Paciente();
        p.setId(rs.getInt("id_paciente"));
        p.setNome(rs.getString("p_nome"));
        p.setCpf(rs.getString("p_cpf"));
        c.setPaciente(p);

        Integer idAgenda = rs.getObject("id_agenda", Integer.class);
        if (idAgenda != null) {
            Agenda a = new Agenda();
            a.setId(idAgenda);
            a.setData(rs.getObject("a_data", LocalDate.class));
            a.setHoraInicio(rs.getObject("hora_inicio", LocalTime.class));
            a.setHoraFim(rs.getObject("hora_fim", LocalTime.class));
            c.setAgenda(a);
        }

        Profissional prof = new Profissional();
        prof.setId(rs.getInt("id_profissional"));
        String profNome = rs.getString("prof_nome");
        if (profNome != null) {
            User u = new User();
            u.setNome(profNome);
            prof.setUsuario(u);
        }
        c.setProfissional(prof);

        return c;
    }
}
