package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class ItemProntuario {

    private Integer id;
    private Prontuario prontuario;
    private String tipoItem;
    private String descricao;
    private LocalDateTime dataRegistro;
    private User usuario;

    public ItemProntuario() {}

    public ItemProntuario(Integer id, Prontuario prontuario, String tipoItem, String descricao,
                          LocalDateTime dataRegistro, User usuario) {
        this.id = id;
        this.prontuario = prontuario;
        this.tipoItem = tipoItem;
        this.descricao = descricao;
        this.dataRegistro = dataRegistro;
        this.usuario = usuario;
    }

    // -- Persistence --

    public static List<ItemProntuario> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT * FROM itens_prontuario ORDER BY id_item_prontuario",
            ItemProntuario::mapRow);
    }

    public static Optional<ItemProntuario> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM itens_prontuario WHERE id_item_prontuario = ?",
            ItemProntuario::mapRow, id);
    }

    public ItemProntuario save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO itens_prontuario (id_prontuario, tipo_item, descricao, data_registro, id_usuario) VALUES (?, ?, ?, ?, ?)",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.tipoItem, this.descricao, this.dataRegistro,
                this.usuario != null ? this.usuario.getId() : null);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE itens_prontuario SET id_prontuario = ?, tipo_item = ?, descricao = ?, data_registro = ?, id_usuario = ? WHERE id_item_prontuario = ?",
                this.prontuario != null ? this.prontuario.getId() : null,
                this.tipoItem, this.descricao, this.dataRegistro,
                this.usuario != null ? this.usuario.getId() : null, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "DELETE FROM itens_prontuario WHERE id_item_prontuario = ?", this.id);
    }

    private static ItemProntuario mapRow(ResultSet rs) throws SQLException {
        ItemProntuario item = new ItemProntuario();
        item.setId(rs.getInt("id_item_prontuario"));
        item.setTipoItem(rs.getString("tipo_item"));
        item.setDescricao(rs.getString("descricao"));
        item.setDataRegistro(rs.getObject("data_registro", LocalDateTime.class));
        return item;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public String getTipoItem() { return tipoItem; }
    public void setTipoItem(String tipoItem) { this.tipoItem = tipoItem; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
}
