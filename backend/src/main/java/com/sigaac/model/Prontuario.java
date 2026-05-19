package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class Prontuario {

    private Integer id;
    private Medico medico;
    private User usuario;
    private Paciente paciente;
    private LocalDate dataAbertura;
    private LocalDate dataFechamento;
    private String observacoesGerais;

    public Prontuario() {}

    public Prontuario(Paciente paciente) {
        this.paciente = paciente;
        this.dataAbertura = LocalDate.now();
    }

    public Prontuario(Integer id, Medico medico, User usuario, Paciente paciente,
                      LocalDate dataAbertura, LocalDate dataFechamento, String observacoesGerais) {
        this.id = id;
        this.medico = medico;
        this.usuario = usuario;
        this.paciente = paciente;
        this.dataAbertura = dataAbertura;
        this.dataFechamento = dataFechamento;
        this.observacoesGerais = observacoesGerais;
    }

    // -- Persistence --

    public static List<Prontuario> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT p.*, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente " +
            "WHERE p.data_fechamento IS NULL " +
            "ORDER BY pac.nome",
            Prontuario::mapRow);
    }

    public static Optional<Prontuario> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT p.*, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente " +
            "WHERE p.id_prontuario = ?",
            Prontuario::mapRow, id);
    }

    public static List<Prontuario> search(String query) {
        var db = DatabaseManager.getInstance();
        String sql = "SELECT p.*, pac.id_paciente, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente WHERE p.data_fechamento IS NULL";
        if (query != null && !query.isBlank()) {
            String pattern = "%" + query.trim() + "%";
            sql += " AND (pac.nome ILIKE ? OR pac.cpf ILIKE ? OR CAST(p.id_prontuario AS TEXT) ILIKE ?)";
            return db.queryList(sql + " ORDER BY pac.nome LIMIT 20", Prontuario::mapRow, pattern, pattern, pattern);
        }
        return db.queryList(sql + " ORDER BY pac.nome LIMIT 20", Prontuario::mapRow);
    }

    public Prontuario save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO prontuarios (id_medico, id_usuario, id_paciente, data_abertura, observacoes_gerais) VALUES (?, ?, ?, ?, ?)",
                this.medico != null ? this.medico.getId() : null,
                this.usuario != null ? this.usuario.getId() : null,
                this.paciente != null ? this.paciente.getId() : null,
                this.dataAbertura, this.observacoesGerais);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE prontuarios SET id_medico = ?, id_usuario = ?, id_paciente = ?, data_abertura = ?, data_fechamento = ?, observacoes_gerais = ? WHERE id_prontuario = ?",
                this.medico != null ? this.medico.getId() : null,
                this.usuario != null ? this.usuario.getId() : null,
                this.paciente != null ? this.paciente.getId() : null,
                this.dataAbertura, this.dataFechamento,
                this.observacoesGerais, this.id);
        }
        return this;
    }

    public static Optional<Prontuario> findByPacienteId(Integer pacienteId) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT p.*, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente " +
            "WHERE p.id_paciente = ? AND p.data_fechamento IS NULL",
            Prontuario::mapRow, pacienteId);
    }

    private static Prontuario mapRow(ResultSet rs) throws SQLException {
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

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public LocalDate getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDate dataAbertura) { this.dataAbertura = dataAbertura; }
    public LocalDate getDataFechamento() { return dataFechamento; }
    public void setDataFechamento(LocalDate dataFechamento) { this.dataFechamento = dataFechamento; }
    public String getObservacoesGerais() { return observacoesGerais; }
    public void setObservacoesGerais(String observacoesGerais) { this.observacoesGerais = observacoesGerais; }
}
