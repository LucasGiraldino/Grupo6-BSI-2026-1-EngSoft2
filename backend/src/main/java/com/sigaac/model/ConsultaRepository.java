package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class ConsultaRepository extends BaseRepository {

    public ConsultaRepository(com.zaxxer.hikari.HikariDataSource ds) { super(ds); }

    private static final String BASE_SELECT =
        "SELECT c.*, " +
        "       pac.id_paciente, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf, " +
        "       prof.id_profissional, prof.especialidade, " +
        "       up.id_usuario AS prof_usuario_id, up.nome AS prof_nome, " +
        "       a.id_agenda, a.data AS agenda_data, a.hora_inicio, a.hora_fim, " +
        "       t.id_triagem, t.pressao_arterial, t.febre, t.condicao_clinica, " +
        "       t.condicao_nutricional, t.condicao_social, t.observacoes AS triagem_observacoes, " +
        "       t.data_triagem, " +
        "       m.id_medico, m.crm, " +
        "       um.id_usuario AS medico_usuario_id, um.nome AS medico_nome " +
        "FROM consultas c " +
        "LEFT JOIN pacientes pac ON c.id_paciente = pac.id_paciente " +
        "LEFT JOIN profissionais prof ON c.id_profissional = prof.id_profissional " +
        "LEFT JOIN users up ON prof.id_usuario = up.id_usuario " +
        "LEFT JOIN agenda a ON c.id_agenda = a.id_agenda " +
        "LEFT JOIN triagens t ON c.id_triagem = t.id_triagem " +
        "LEFT JOIN medicos m ON t.id_medico = m.id_medico " +
        "LEFT JOIN users um ON m.id_usuario = um.id_usuario ";

    public List<Consulta> findAll() {
        return queryList(BASE_SELECT + "ORDER BY c.data_agendamento DESC", this::mapRow);
    }

    public Optional<Consulta> findById(Integer id) {
        return querySingle(BASE_SELECT + "WHERE c.id_consulta = ?", this::mapRow, id);
    }

    public Consulta save(Consulta consulta) {
        if (consulta.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO consultas (id_paciente, id_profissional, id_agenda, id_triagem, tipo_consulta, status, observacoes, data_agendamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                consulta.getPaciente() != null ? consulta.getPaciente().getId() : null,
                consulta.getProfissional() != null ? consulta.getProfissional().getId() : null,
                consulta.getAgenda() != null ? consulta.getAgenda().getId() : null,
                consulta.getTriagem() != null ? consulta.getTriagem().getId() : null,
                consulta.getTipoConsulta(),
                consulta.getStatus(),
                consulta.getObservacoes(),
                consulta.getDataAgendamento());
            if (id != null) consulta.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE consultas SET id_paciente = ?, id_profissional = ?, id_agenda = ?, id_triagem = ?, tipo_consulta = ?, status = ?, observacoes = ?, data_agendamento = ?, data_cancelamento = ? WHERE id_consulta = ?",
                consulta.getPaciente() != null ? consulta.getPaciente().getId() : null,
                consulta.getProfissional() != null ? consulta.getProfissional().getId() : null,
                consulta.getAgenda() != null ? consulta.getAgenda().getId() : null,
                consulta.getTriagem() != null ? consulta.getTriagem().getId() : null,
                consulta.getTipoConsulta(),
                consulta.getStatus(),
                consulta.getObservacoes(),
                consulta.getDataAgendamento(),
                consulta.getDataCancelamento(),
                consulta.getId());
        }
        return consulta;
    }

    public List<Consulta> findByStatus(String status) {
        return queryList(BASE_SELECT + "WHERE c.status = ? ORDER BY c.data_agendamento ASC", this::mapRow, status);
    }

    public List<Consulta> findByProfissionalAndDataBetween(Integer profissionalId, LocalDate inicio, LocalDate fim) {
        return queryList(
            BASE_SELECT +
            "WHERE c.id_profissional = ? AND a.data BETWEEN ? AND ? " +
            "ORDER BY a.data, a.hora_inicio",
            this::mapRow, profissionalId, java.sql.Date.valueOf(inicio), java.sql.Date.valueOf(fim));
    }

    public void deleteById(Integer id) {
        executeUpdate("DELETE FROM consultas WHERE id_consulta = ?", id);
    }

    private Consulta mapRow(ResultSet rs) throws SQLException {
        Consulta c = new Consulta();
        c.setId(rs.getInt("id_consulta"));
        c.setTipoConsulta(rs.getString("tipo_consulta"));
        c.setStatus(rs.getString("status"));
        c.setObservacoes(rs.getString("observacoes"));
        c.setDataAgendamento(rs.getObject("data_agendamento", LocalDateTime.class));
        c.setDataCancelamento(rs.getObject("data_cancelamento", LocalDateTime.class));

        Paciente pac = new Paciente();
        pac.setId(rs.getObject("id_paciente", Integer.class));
        pac.setNome(rs.getString("paciente_nome"));
        pac.setCpf(rs.getString("paciente_cpf"));
        c.setPaciente(pac);

        Integer profId = rs.getObject("id_profissional", Integer.class);
        if (profId != null) {
            Profissional prof = new Profissional();
            prof.setId(profId);
            prof.setEspecialidade(rs.getString("especialidade"));
            User up = new User();
            up.setId(rs.getObject("prof_usuario_id", Integer.class));
            up.setNome(rs.getString("prof_nome"));
            prof.setUsuario(up);
            c.setProfissional(prof);
        }

        Integer agendaId = rs.getObject("id_agenda", Integer.class);
        if (agendaId != null) {
            Agenda a = new Agenda();
            a.setId(agendaId);
            a.setData(rs.getObject("agenda_data", java.time.LocalDate.class));
            a.setHoraInicio(rs.getObject("hora_inicio", java.time.LocalTime.class));
            a.setHoraFim(rs.getObject("hora_fim", java.time.LocalTime.class));
            c.setAgenda(a);
        }

        Integer triagemId = rs.getObject("id_triagem", Integer.class);
        if (triagemId != null) {
            Triagem t = new Triagem();
            t.setId(triagemId);
            t.setPressaoArterial(rs.getString("pressao_arterial"));
            t.setFebre(rs.getBigDecimal("febre"));
            t.setCondicaoClinica(rs.getString("condicao_clinica"));
            t.setCondicaoNutricional(rs.getString("condicao_nutricional"));
            t.setCondicaoSocial(rs.getString("condicao_social"));
            t.setObservacoes(rs.getString("triagem_observacoes"));
            t.setDataTriagem(rs.getObject("data_triagem", LocalDateTime.class));
            Medico m = new Medico();
            m.setId(rs.getObject("id_medico", Integer.class));
            m.setCrm(rs.getString("crm"));
            User um = new User();
            um.setId(rs.getObject("medico_usuario_id", Integer.class));
            um.setNome(rs.getString("medico_nome"));
            m.setUsuario(um);
            t.setMedico(m);
            c.setTriagem(t);
        }

        return c;
    }
}
