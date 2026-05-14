package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class Medico {

    private Integer id;
    private User usuario;
    private Endereco endereco;
    private String crm;
    private String especialidadeMedica;
    private LocalDate dataAdmissao;
    private Boolean ativo = true;
    private LocalDateTime deletedAt;

    public Medico() {}

    public Medico(Integer id, User usuario, Endereco endereco, String crm,
                  String especialidadeMedica, LocalDate dataAdmissao, Boolean ativo, LocalDateTime deletedAt) {
        this.id = id;
        this.usuario = usuario;
        this.endereco = endereco;
        this.crm = crm;
        this.especialidadeMedica = especialidadeMedica;
        this.dataAdmissao = dataAdmissao;
        this.ativo = ativo;
        this.deletedAt = deletedAt;
    }

    // -- Persistence --

    public static List<Medico> findAll() {
        return DatabaseHelper.getInstance().queryList(
            "SELECT m.*, u.nome AS usuario_nome, u.email AS usuario_email FROM medicos m " +
            "JOIN users u ON m.id_usuario = u.id_usuario " +
            "WHERE m.deleted_at IS NULL ORDER BY u.nome",
            Medico::mapRow);
    }

    public static Optional<Medico> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT m.*, u.nome AS usuario_nome, u.email AS usuario_email FROM medicos m " +
            "JOIN users u ON m.id_usuario = u.id_usuario " +
            "WHERE m.id_medico = ? AND m.deleted_at IS NULL",
            Medico::mapRow, id);
    }

    public Medico save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO medicos (id_usuario, id_endereco, especialidade_medica, crm, data_admissao, ativo) VALUES (?, ?, ?, ?, ?, ?)",
                this.usuario != null ? this.usuario.getId() : null,
                this.endereco != null ? this.endereco.getId() : null,
                this.especialidadeMedica, this.crm, this.dataAdmissao, true);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE medicos SET id_usuario = ?, id_endereco = ?, especialidade_medica = ?, crm = ?, data_admissao = ?, ativo = ? WHERE id_medico = ?",
                this.usuario != null ? this.usuario.getId() : null,
                this.endereco != null ? this.endereco.getId() : null,
                this.especialidadeMedica, this.crm, this.dataAdmissao, true,
                this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate(
            "UPDATE medicos SET deleted_at = NOW() WHERE id_medico = ?", this.id);
    }

    private static Medico mapRow(ResultSet rs) throws SQLException {
        Medico m = new Medico();
        m.setId(rs.getInt("id_medico"));
        m.setCrm(rs.getString("crm"));
        m.setEspecialidadeMedica(rs.getString("especialidade_medica"));
        m.setDataAdmissao(rs.getObject("data_admissao", LocalDate.class));
        m.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        u.setNome(rs.getString("usuario_nome"));
        u.setEmail(rs.getString("usuario_email"));
        m.setUsuario(u);
        return m;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }
    public String getEspecialidadeMedica() { return especialidadeMedica; }
    public void setEspecialidadeMedica(String especialidadeMedica) { this.especialidadeMedica = especialidadeMedica; }
    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
