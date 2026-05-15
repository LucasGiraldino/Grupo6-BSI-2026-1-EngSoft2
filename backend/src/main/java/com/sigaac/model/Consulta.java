package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Consulta {

    private Integer id;
    private Paciente paciente;
    private Agenda agenda;
    private Profissional profissional;
    private Triagem triagem;
    private String tipoConsulta;
    private String status;
    private String observacoes;
    private LocalDateTime dataAgendamento;
    private LocalDateTime dataCancelamento;

    public Consulta() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public Agenda getAgenda() { return agenda; }
    public void setAgenda(Agenda agenda) { this.agenda = agenda; }
    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }
    public Triagem getTriagem() { return triagem; }
    public void setTriagem(Triagem triagem) { this.triagem = triagem; }
    public String getTipoConsulta() { return tipoConsulta; }
    public void setTipoConsulta(String tipoConsulta) { this.tipoConsulta = tipoConsulta; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public LocalDateTime getDataAgendamento() { return dataAgendamento; }
    public void setDataAgendamento(LocalDateTime dataAgendamento) { this.dataAgendamento = dataAgendamento; }
    public LocalDateTime getDataCancelamento() { return dataCancelamento; }
    public void setDataCancelamento(LocalDateTime dataCancelamento) { this.dataCancelamento = dataCancelamento; }

    // -- Persistence --

    private static final String BASE_SELECT =
        "SELECT c.*, p.id_paciente, p.nome AS p_nome, p.cpf AS p_cpf, " +
        "a.id_agenda, a.data AS a_data, a.hora_inicio, a.hora_fim, " +
        "pr.id_profissional, u.nome AS prof_nome " +
        "FROM consultas c " +
        "JOIN pacientes p ON p.id_paciente = c.id_paciente " +
        "LEFT JOIN agenda a ON a.id_agenda = c.id_agenda " +
        "LEFT JOIN profissionais pr ON pr.id_profissional = c.id_profissional " +
        "LEFT JOIN users u ON u.id_usuario = pr.id_usuario";

    public static List<Consulta> findAll() { return findAll(null); }

    public static List<Consulta> findAll(String status) {
        var db = DatabaseHelper.getInstance();
        if (status != null && !status.isBlank()) {
            return db.queryList(BASE_SELECT + " WHERE c.status = ? ORDER BY c.data_agendamento DESC",
                Consulta::mapRow, status);
        }
        return db.queryList(BASE_SELECT + " ORDER BY c.data_agendamento DESC", Consulta::mapRow);
    }

    public static List<Consulta> findByAgendaPeriodo(Integer profissional, String dataInicio, String dataFim) {
        var db = DatabaseHelper.getInstance();
        String sql = BASE_SELECT + " WHERE 1=1";
        List<Object> params = new ArrayList<>();
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
        return db.queryList(sql, Consulta::mapRow, params.toArray());
    }

    public static Optional<Consulta> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            BASE_SELECT + " WHERE c.id_consulta = ?", Consulta::mapRow, id);
    }

    public Consulta save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO consultas (id_paciente, id_agenda, id_profissional, tipo_consulta, status, observacoes, data_agendamento, id_triagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                this.paciente != null ? this.paciente.getId() : null,
                this.agenda != null ? this.agenda.getId() : null,
                this.profissional != null ? this.profissional.getId() : null,
                this.tipoConsulta, this.status,
                this.observacoes, this.dataAgendamento,
                this.triagem != null ? this.triagem.getId() : null);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE consultas SET id_paciente = ?, id_agenda = ?, id_profissional = ?, tipo_consulta = ?, status = ?, observacoes = ?, id_triagem = ? WHERE id_consulta = ?",
                this.paciente != null ? this.paciente.getId() : null,
                this.agenda != null ? this.agenda.getId() : null,
                this.profissional != null ? this.profissional.getId() : null,
                this.tipoConsulta, this.status,
                this.observacoes,
                this.triagem != null ? this.triagem.getId() : null,
                this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate(
            "DELETE FROM consultas WHERE id_consulta = ?", this.id);
    }

    public void cancelar() {
        var db = DatabaseHelper.getInstance();
        if (!"AGENDADA".equals(this.status)) {
            throw new IllegalStateException("A consulta nao esta no status AGENDADA e nao pode ser cancelada.");
        }

        db.executeInTransaction(conn -> {
            try (var stmt = conn.prepareStatement(
                    "UPDATE consultas SET status = 'CANCELADA', data_cancelamento = ? WHERE id_consulta = ?")) {
                stmt.setObject(1, LocalDateTime.now());
                stmt.setInt(2, this.id);
                stmt.executeUpdate();
            }

            Integer idAgenda = null;
            try (var stmt = conn.prepareStatement("SELECT id_agenda FROM consultas WHERE id_consulta = ?")) {
                stmt.setInt(1, this.id);
                var rs = stmt.executeQuery();
                if (rs.next()) {
                    idAgenda = rs.getObject("id_agenda", Integer.class);
                }
            }

            if (idAgenda != null) {
                try (var stmt = conn.prepareStatement("UPDATE agenda SET disponivel = TRUE WHERE id_agenda = ?")) {
                    stmt.setInt(1, idAgenda);
                    stmt.executeUpdate();
                }
            }
        });

        this.status = "CANCELADA";
        this.dataCancelamento = LocalDateTime.now();
    }

    private static Consulta mapRow(ResultSet rs) throws SQLException {
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

        Integer idTriagem = rs.getObject("id_triagem", Integer.class);
        if (idTriagem != null) {
            Triagem t = new Triagem();
            t.setId(idTriagem);
            c.setTriagem(t);
        }

        return c;
    }
}
