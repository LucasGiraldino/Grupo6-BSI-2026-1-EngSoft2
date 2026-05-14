package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Exame {

    private Integer id;
    private Prontuario prontuario;
    private Medico medico;
    private TipoExame tipoExame;
    private String justificativaClinica;
    private LocalDateTime dataSolicitacao;
    private String status;
    private String observacoesMedico;
    private LocalDate dataRealizacao;
    private LocalDateTime deletedAt;

    public Exame() {}

    public Exame(Integer id, Prontuario prontuario, Medico medico, TipoExame tipoExame,
                 String justificativaClinica, LocalDateTime dataSolicitacao, String status,
                 String observacoesMedico, LocalDate dataRealizacao, LocalDateTime deletedAt) {
        this.id = id;
        this.prontuario = prontuario;
        this.medico = medico;
        this.tipoExame = tipoExame;
        this.justificativaClinica = justificativaClinica;
        this.dataSolicitacao = dataSolicitacao;
        this.status = status;
        this.observacoesMedico = observacoesMedico;
        this.dataRealizacao = dataRealizacao;
        this.deletedAt = deletedAt;
    }

    // -- Persistence --

    private static final String BASE_SELECT =
        "SELECT e.*, " +
        "       te.id_tipo_exame, te.nome AS te_nome, te.descricao AS te_descricao, te.ativo AS te_ativo, " +
        "       m.id_medico, m.crm, m.especialidade_medica, " +
        "       u.id_usuario, u.nome AS medico_nome, " +
        "       p.id_prontuario, p.data_abertura AS p_data_abertura, p.data_fechamento AS p_data_fechamento, " +
        "       pac.id_paciente, pac.nome AS paciente_nome " +
        "FROM exames e " +
        "LEFT JOIN tipos_exame te ON e.id_tipo_exame = te.id_tipo_exame " +
        "LEFT JOIN medicos m ON e.id_medico = m.id_medico " +
        "LEFT JOIN users u ON m.id_usuario = u.id_usuario " +
        "LEFT JOIN prontuarios p ON e.id_prontuario = p.id_prontuario " +
        "LEFT JOIN pacientes pac ON p.id_paciente = pac.id_paciente ";

    public static List<Exame> findAll() { return findAll(null, null); }

    public static List<Exame> findAll(String status, Integer tipoExameId) {
        var db = DatabaseHelper.getInstance();
        String sql = BASE_SELECT + "WHERE e.deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (status != null && !status.isBlank()) {
            sql += " AND e.status = ?";
            params.add(status);
        }
        if (tipoExameId != null) {
            sql += " AND e.id_tipo_exame = ?";
            params.add(tipoExameId);
        }
        sql += " ORDER BY e.id_exame";
        return db.queryList(sql, Exame::mapRow, params.toArray());
    }

    public static Optional<Exame> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            BASE_SELECT + "WHERE e.id_exame = ? AND e.deleted_at IS NULL", Exame::mapRow, id);
    }

    public Exame save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            if (this.dataSolicitacao == null) {
                this.dataSolicitacao = LocalDateTime.now();
            }
            Number id = db.executeInsert(
                "INSERT INTO exames (id_prontuario, id_medico, id_tipo_exame, justificativa_clinica, data_solicitacao, status, observacoes_medico, data_realizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.medico != null ? this.medico.getId() : null,
                this.tipoExame != null ? this.tipoExame.getId() : null,
                this.justificativaClinica,
                this.dataSolicitacao,
                this.status,
                this.observacoesMedico,
                this.dataRealizacao);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE exames SET id_prontuario = ?, id_medico = ?, id_tipo_exame = ?, justificativa_clinica = ?, data_solicitacao = ?, status = ?, observacoes_medico = ?, data_realizacao = ? WHERE id_exame = ?",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.medico != null ? this.medico.getId() : null,
                this.tipoExame != null ? this.tipoExame.getId() : null,
                this.justificativaClinica,
                this.dataSolicitacao,
                this.status,
                this.observacoesMedico,
                this.dataRealizacao,
                this.id);
        }
        return this;
    }

    public Exame merge(Exame request) {
        if (request.getProntuario() != null) this.prontuario = request.getProntuario();
        if (request.getMedico() != null) this.medico = request.getMedico();
        if (request.getTipoExame() != null) this.tipoExame = request.getTipoExame();
        if (request.getJustificativaClinica() != null) this.justificativaClinica = request.getJustificativaClinica();
        if (request.getDataSolicitacao() != null) this.dataSolicitacao = request.getDataSolicitacao();
        if (request.getStatus() != null) this.status = request.getStatus();
        if (request.getObservacoesMedico() != null) this.observacoesMedico = request.getObservacoesMedico();
        if (request.getDataRealizacao() != null) this.dataRealizacao = request.getDataRealizacao();
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate(
            "UPDATE exames SET deleted_at = NOW() WHERE id_exame = ?", this.id);
    }

    private static Exame mapRow(ResultSet rs) throws SQLException {
        Exame e = new Exame();
        e.setId(rs.getInt("id_exame"));
        e.setJustificativaClinica(rs.getString("justificativa_clinica"));
        e.setDataSolicitacao(rs.getObject("data_solicitacao", LocalDateTime.class));
        e.setStatus(rs.getString("status"));
        e.setObservacoesMedico(rs.getString("observacoes_medico"));
        e.setDataRealizacao(rs.getObject("data_realizacao", LocalDate.class));
        e.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));

        TipoExame te = new TipoExame();
        te.setId(rs.getInt("id_tipo_exame"));
        te.setNome(rs.getString("te_nome"));
        te.setDescricao(rs.getString("te_descricao"));
        te.setAtivo(rs.getObject("te_ativo", Boolean.class));
        e.setTipoExame(te);

        Medico m = new Medico();
        m.setId(rs.getInt("id_medico"));
        m.setCrm(rs.getString("crm"));
        m.setEspecialidadeMedica(rs.getString("especialidade_medica"));
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        u.setNome(rs.getString("medico_nome"));
        m.setUsuario(u);
        e.setMedico(m);

        Prontuario p = new Prontuario();
        p.setId(rs.getInt("id_prontuario"));
        p.setDataAbertura(rs.getObject("p_data_abertura", LocalDate.class));
        p.setDataFechamento(rs.getObject("p_data_fechamento", LocalDate.class));
        Paciente pac = new Paciente();
        pac.setId(rs.getObject("id_paciente", Integer.class));
        pac.setNome(rs.getString("paciente_nome"));
        p.setPaciente(pac);
        e.setProntuario(p);

        return e;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }
    public TipoExame getTipoExame() { return tipoExame; }
    public void setTipoExame(TipoExame tipoExame) { this.tipoExame = tipoExame; }
    public String getJustificativaClinica() { return justificativaClinica; }
    public void setJustificativaClinica(String justificativaClinica) { this.justificativaClinica = justificativaClinica; }
    public LocalDateTime getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(LocalDateTime dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getObservacoesMedico() { return observacoesMedico; }
    public void setObservacoesMedico(String observacoesMedico) { this.observacoesMedico = observacoesMedico; }
    public LocalDate getDataRealizacao() { return dataRealizacao; }
    public void setDataRealizacao(LocalDate dataRealizacao) { this.dataRealizacao = dataRealizacao; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
