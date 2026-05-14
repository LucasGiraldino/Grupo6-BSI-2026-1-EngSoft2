package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class TipoExame {

    private Integer id;
    private String nome;
    private String descricao;
    private Boolean ativo = true;

    public TipoExame() {}

    public TipoExame(Integer id, String nome, String descricao, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.ativo = ativo;
    }

    // -- Persistence --

    public static List<TipoExame> findAll() {
        return DatabaseHelper.getInstance().queryList(
            "SELECT * FROM tipos_exame ORDER BY id_tipo_exame",
            TipoExame::mapRow);
    }

    public static Optional<TipoExame> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM tipos_exame WHERE id_tipo_exame = ?",
            TipoExame::mapRow, id);
    }

    public TipoExame save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO tipos_exame (nome, descricao, ativo) VALUES (?, ?, ?)",
                this.nome, this.descricao, this.ativo != null ? this.ativo : true);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE tipos_exame SET nome = ?, descricao = ?, ativo = ? WHERE id_tipo_exame = ?",
                this.nome, this.descricao, this.ativo, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate(
            "DELETE FROM tipos_exame WHERE id_tipo_exame = ?", this.id);
    }

    private static TipoExame mapRow(ResultSet rs) throws SQLException {
        TipoExame t = new TipoExame();
        t.setId(rs.getInt("id_tipo_exame"));
        t.setNome(rs.getString("nome"));
        t.setDescricao(rs.getString("descricao"));
        t.setAtivo(rs.getObject("ativo", Boolean.class));
        return t;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
