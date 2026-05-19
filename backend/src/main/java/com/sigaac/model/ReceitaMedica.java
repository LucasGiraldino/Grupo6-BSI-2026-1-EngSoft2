package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class ReceitaMedica {

    private Integer id;
    private Prontuario prontuario;
    private Medico medico;
    private LocalDateTime dataEmissao;
    private String descricao;
    private LocalDate dataValidade;

    public ReceitaMedica() {}

    public ReceitaMedica(Integer id, Prontuario prontuario, Medico medico,
                         LocalDateTime dataEmissao, String descricao, LocalDate dataValidade) {
        this.id = id;
        this.prontuario = prontuario;
        this.medico = medico;
        this.dataEmissao = dataEmissao;
        this.descricao = descricao;
        this.dataValidade = dataValidade;
    }

    // -- Persistence --

    public static List<ReceitaMedica> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT * FROM receitas_medicas ORDER BY id_receita",
            ReceitaMedica::mapRow);
    }

    public static Optional<ReceitaMedica> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM receitas_medicas WHERE id_receita = ?",
            ReceitaMedica::mapRow, id);
    }

    public ReceitaMedica save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO receitas_medicas (id_prontuario, id_medico, data_emissao, descricao, data_validade) VALUES (?, ?, ?, ?, ?)",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.medico != null ? this.medico.getId() : null,
                this.dataEmissao, this.descricao, this.dataValidade);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE receitas_medicas SET id_prontuario = ?, id_medico = ?, data_emissao = ?, descricao = ?, data_validade = ? WHERE id_receita = ?",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.medico != null ? this.medico.getId() : null,
                this.dataEmissao, this.descricao, this.dataValidade, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "DELETE FROM receitas_medicas WHERE id_receita = ?", this.id);
    }

    private static ReceitaMedica mapRow(ResultSet rs) throws SQLException {
        ReceitaMedica r = new ReceitaMedica();
        r.setId(rs.getInt("id_receita"));
        r.setDataEmissao(rs.getObject("data_emissao", LocalDateTime.class));
        r.setDescricao(rs.getString("descricao"));
        r.setDataValidade(rs.getObject("data_validade", LocalDate.class));
        return r;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public Medico getMedico() { return medico; }
    public void setMedico(Medico medico) { this.medico = medico; }
    public LocalDateTime getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDateTime dataEmissao) { this.dataEmissao = dataEmissao; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
}
