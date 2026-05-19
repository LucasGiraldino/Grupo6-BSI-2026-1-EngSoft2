package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class CategoriaAlimento {

    private Integer id;
    private String nome;
    private String descricao;

    public CategoriaAlimento() {}

    public CategoriaAlimento(Integer id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    // -- Persistence --

    public static List<CategoriaAlimento> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT * FROM categorias_alimentos ORDER BY id_categoria",
            CategoriaAlimento::mapRow);
    }

    public static Optional<CategoriaAlimento> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM categorias_alimentos WHERE id_categoria = ?",
            CategoriaAlimento::mapRow, id);
    }

    public static boolean existsById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT 1 FROM categorias_alimentos WHERE id_categoria = ?",
            rs -> true, id).orElse(false);
    }

    public CategoriaAlimento save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO categorias_alimentos (nome, descricao) VALUES (?, ?)",
                this.nome, this.descricao);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE categorias_alimentos SET nome = ?, descricao = ? WHERE id_categoria = ?",
                this.nome, this.descricao, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "DELETE FROM categorias_alimentos WHERE id_categoria = ?", this.id);
    }

    private static CategoriaAlimento mapRow(ResultSet rs) throws SQLException {
        CategoriaAlimento c = new CategoriaAlimento();
        c.setId(rs.getInt("id_categoria"));
        c.setNome(rs.getString("nome"));
        c.setDescricao(rs.getString("descricao"));
        return c;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
