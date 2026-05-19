package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Triagem {

    private Integer id;
    private Prontuario prontuario;
    private Medico medico;
    private LocalDateTime dataTriagem;
    private String pressaoArterial;
    private BigDecimal febre;
    private String condicaoClinica;
    private String condicaoNutricional;
    private String condicaoSocial;
    private String observacoes;
    private LocalDateTime deletedAt;

    public Triagem() {}

    public Triagem(Integer id, Prontuario prontuario, Medico medico, LocalDateTime dataTriagem,
                   String pressaoArterial, BigDecimal febre, String condicaoClinica,
                   String condicaoNutricional, String condicaoSocial, String observacoes,
                   LocalDateTime deletedAt) {
        this.id = id;
        this.prontuario = prontuario;
        this.medico = medico;
        this.dataTriagem = dataTriagem;
        this.pressaoArterial = pressaoArterial;
        this.febre = febre;
        this.condicaoClinica = condicaoClinica;
        this.condicaoNutricional = condicaoNutricional;
        this.condicaoSocial = condicaoSocial;
        this.observacoes = observacoes;
        this.deletedAt = deletedAt;
    }

    // -- Persistence --

    private static final String BASE_SELECT =
        "SELECT t.*, " +
        "       m.id_medico, m.crm, m.especialidade_medica, " +
        "       u.id_usuario, u.nome AS medico_nome, " +
        "       p.id_prontuario, p.data_abertura AS p_data_abertura, " +
        "       pac.id_paciente, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf " +
        "FROM triagens t " +
        "LEFT JOIN medicos m ON t.id_medico = m.id_medico " +
        "LEFT JOIN users u ON m.id_usuario = u.id_usuario " +
        "LEFT JOIN prontuarios p ON t.id_prontuario = p.id_prontuario " +
        "LEFT JOIN pacientes pac ON p.id_paciente = pac.id_paciente ";

    public static List<Triagem> findAll() { return findAll(null, null); }

    public static List<Triagem> findAll(String nomePaciente, Integer medicoId) {
        var db = DatabaseManager.getInstance();
        String sql = BASE_SELECT + "WHERE t.deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (nomePaciente != null && !nomePaciente.isBlank()) {
            sql += " AND pac.nome ILIKE ?";
            params.add("%" + nomePaciente.trim() + "%");
        }
        if (medicoId != null) {
            sql += " AND t.id_medico = ?";
            params.add(medicoId);
        }
        sql += " ORDER BY t.data_triagem DESC";
        return db.queryList(sql, Triagem::mapRow, params.toArray());
    }

    public static Optional<Triagem> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            BASE_SELECT + "WHERE t.id_triagem = ? AND t.deleted_at IS NULL", Triagem::mapRow, id);
    }

    public Triagem save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            if (this.dataTriagem == null) {
                this.dataTriagem = LocalDateTime.now();
            }
            Number id = db.executeInsert(
                "INSERT INTO triagens (id_prontuario, id_medico, data_triagem, pressao_arterial, febre, condicao_clinica, condicao_nutricional, condicao_social, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.medico != null ? this.medico.getId() : null,
                this.dataTriagem,
                this.pressaoArterial,
                this.febre,
                this.condicaoClinica,
                this.condicaoNutricional,
                this.condicaoSocial,
                this.observacoes);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE triagens SET id_prontuario = ?, id_medico = ?, data_triagem = ?, pressao_arterial = ?, febre = ?, condicao_clinica = ?, condicao_nutricional = ?, condicao_social = ?, observacoes = ? WHERE id_triagem = ?",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.medico != null ? this.medico.getId() : null,
                this.dataTriagem,
                this.pressaoArterial,
                this.febre,
                this.condicaoClinica,
                this.condicaoNutricional,
                this.condicaoSocial,
                this.observacoes,
                this.id);
        }
        return this;
    }

    public Triagem merge(Triagem request) {
        if (request.getProntuario() != null) this.prontuario = request.getProntuario();
        if (request.getMedico() != null) this.medico = request.getMedico();
        if (request.getDataTriagem() != null) this.dataTriagem = request.getDataTriagem();
        if (request.getPressaoArterial() != null) this.pressaoArterial = request.getPressaoArterial();
        if (request.getFebre() != null) this.febre = request.getFebre();
        if (request.getCondicaoClinica() != null) this.condicaoClinica = request.getCondicaoClinica();
        if (request.getCondicaoNutricional() != null) this.condicaoNutricional = request.getCondicaoNutricional();
        if (request.getCondicaoSocial() != null) this.condicaoSocial = request.getCondicaoSocial();
        if (request.getObservacoes() != null) this.observacoes = request.getObservacoes();
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "UPDATE triagens SET deleted_at = NOW() WHERE id_triagem = ?", this.id);
    }

    private static Triagem mapRow(ResultSet rs) throws SQLException {
        Triagem t = new Triagem();
        t.setId(rs.getInt("id_triagem"));
        t.setDataTriagem(rs.getObject("data_triagem", LocalDateTime.class));
        t.setPressaoArterial(rs.getString("pressao_arterial"));
        t.setFebre(rs.getBigDecimal("febre"));
        t.setCondicaoClinica(rs.getString("condicao_clinica"));
        t.setCondicaoNutricional(rs.getString("condicao_nutricional"));
        t.setCondicaoSocial(rs.getString("condicao_social"));
        t.setObservacoes(rs.getString("observacoes"));
        t.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));

        Medico m = new Medico();
        m.setId(rs.getInt("id_medico"));
        m.setCrm(rs.getString("crm"));
        m.setEspecialidadeMedica(rs.getString("especialidade_medica"));
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        u.setNome(rs.getString("medico_nome"));
        m.setUsuario(u);
        t.setMedico(m);

        Prontuario p = new Prontuario();
        p.setId(rs.getInt("id_prontuario"));
        p.setDataAbertura(rs.getObject("p_data_abertura", LocalDate.class));
        Paciente pac = new Paciente();
        pac.setId(rs.getObject("id_paciente", Integer.class));
        pac.setNome(rs.getString("paciente_nome"));
        pac.setCpf(rs.getString("paciente_cpf"));
        p.setPaciente(pac);
        t.setProntuario(p);

        return t;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }
    public LocalDateTime getDataTriagem() { return dataTriagem; }
    public void setDataTriagem(LocalDateTime dataTriagem) { this.dataTriagem = dataTriagem; }
    public String getPressaoArterial() { return pressaoArterial; }
    public void setPressaoArterial(String pressaoArterial) { this.pressaoArterial = pressaoArterial; }
    public BigDecimal getFebre() { return febre; }
    public void setFebre(BigDecimal febre) { this.febre = febre; }
    public String getCondicaoClinica() { return condicaoClinica; }
    public void setCondicaoClinica(String condicaoClinica) { this.condicaoClinica = condicaoClinica; }
    public String getCondicaoNutricional() { return condicaoNutricional; }
    public void setCondicaoNutricional(String condicaoNutricional) { this.condicaoNutricional = condicaoNutricional; }
    public String getCondicaoSocial() { return condicaoSocial; }
    public void setCondicaoSocial(String condicaoSocial) { this.condicaoSocial = condicaoSocial; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
