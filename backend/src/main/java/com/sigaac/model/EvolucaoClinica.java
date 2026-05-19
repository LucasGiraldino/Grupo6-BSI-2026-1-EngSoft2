package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class EvolucaoClinica {

    private Integer id;
    private Prontuario prontuario;
    private User usuario;
    private Profissional profissional;
    private LocalDateTime dataRegistro;
    private String setor;
    private String descricao;

    public EvolucaoClinica() {}

    public EvolucaoClinica(Integer id, Prontuario prontuario, User usuario, Profissional profissional,
                           LocalDateTime dataRegistro, String setor, String descricao) {
        this.id = id;
        this.prontuario = prontuario;
        this.usuario = usuario;
        this.profissional = profissional;
        this.dataRegistro = dataRegistro;
        this.setor = setor;
        this.descricao = descricao;
    }

    // -- Persistence --

    public static List<EvolucaoClinica> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT * FROM evolucoes_clinicas ORDER BY id_evolucao",
            EvolucaoClinica::mapRow);
    }

    public static Optional<EvolucaoClinica> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM evolucoes_clinicas WHERE id_evolucao = ?",
            EvolucaoClinica::mapRow, id);
    }

    public EvolucaoClinica save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO evolucoes_clinicas (id_prontuario, id_usuario, id_profissional, data_registro, setor, descricao) VALUES (?, ?, ?, ?, ?, ?)",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.usuario != null ? this.usuario.getId() : null,
                this.profissional != null ? this.profissional.getId() : null,
                this.dataRegistro, this.setor, this.descricao);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE evolucoes_clinicas SET id_prontuario = ?, id_usuario = ?, id_profissional = ?, data_registro = ?, setor = ?, descricao = ? WHERE id_evolucao = ?",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.usuario != null ? this.usuario.getId() : null,
                this.profissional != null ? this.profissional.getId() : null,
                this.dataRegistro, this.setor, this.descricao, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "DELETE FROM evolucoes_clinicas WHERE id_evolucao = ?", this.id);
    }

    private static EvolucaoClinica mapRow(ResultSet rs) throws SQLException {
        EvolucaoClinica e = new EvolucaoClinica();
        e.setId(rs.getInt("id_evolucao"));
        e.setDataRegistro(rs.getObject("data_registro", LocalDateTime.class));
        e.setSetor(rs.getString("setor"));
        e.setDescricao(rs.getString("descricao"));
        return e;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }
    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }
    public String getSetor() { return setor; }
    public void setSetor(String setor) { this.setor = setor; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
