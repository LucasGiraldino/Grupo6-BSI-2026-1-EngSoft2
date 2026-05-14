package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Alimento {

    private Integer id;
    private CategoriaAlimento categoria;
    private String nome;
    private String descricao;
    private UnidadeMedida unidadeMedida;
    private LocalDate dataVencimento;
    private Boolean ativo = true;
    private LocalDateTime deletedAt;

    public Alimento() {}

    public Alimento(Integer id, CategoriaAlimento categoria, String nome, String descricao,
                    UnidadeMedida unidadeMedida, LocalDate dataVencimento, Boolean ativo, LocalDateTime deletedAt) {
        this.id = id;
        this.categoria = categoria;
        this.nome = nome;
        this.descricao = descricao;
        this.unidadeMedida = unidadeMedida;
        this.dataVencimento = dataVencimento;
        this.ativo = ativo;
        this.deletedAt = deletedAt;
    }

    // -- Persistence --

    public static List<Alimento> findAll() { return findAll(null, null); }

    public static List<Alimento> findAll(String nome, Integer categoriaId) {
        var db = DatabaseHelper.getInstance();
        String sql = "SELECT * FROM alimentos WHERE deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (nome != null && !nome.isBlank()) {
            sql += " AND nome ILIKE ?";
            params.add("%" + nome.trim() + "%");
        }
        if (categoriaId != null) {
            sql += " AND id_categoria = ?";
            params.add(categoriaId);
        }
        sql += " ORDER BY id_alimento";
        return db.queryList(sql, Alimento::mapRow, params.toArray());
    }

    public static Optional<Alimento> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM alimentos WHERE id_alimento = ? AND deleted_at IS NULL",
            Alimento::mapRow, id);
    }

    public static boolean existsById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT 1 FROM alimentos WHERE id_alimento = ? AND deleted_at IS NULL",
            rs -> true, id).orElse(false);
    }

    public Alimento save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO alimentos (id_categoria, nome, descricao, unidade_medida, data_vencimento) VALUES (?, ?, ?, ?, ?)",
                this.categoria != null ? this.categoria.getId() : null,
                this.nome, this.descricao,
                this.unidadeMedida != null ? this.unidadeMedida.name() : null,
                this.dataVencimento);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE alimentos SET id_categoria = ?, nome = ?, descricao = ?, unidade_medida = ?, data_vencimento = ? WHERE id_alimento = ?",
                this.categoria != null ? this.categoria.getId() : null,
                this.nome, this.descricao,
                this.unidadeMedida != null ? this.unidadeMedida.name() : null,
                this.dataVencimento, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate(
            "UPDATE alimentos SET deleted_at = NOW() WHERE id_alimento = ?", this.id);
    }

    public Alimento criarComEstoque() {
        Alimento salvo = this.save();

        Estoque estoque = new Estoque();
        estoque.setAlimento(salvo);
        estoque.setQuantidadeAtual(java.math.BigDecimal.ZERO);
        estoque.setQuantidadeMinima(java.math.BigDecimal.ZERO);
        estoque.setDataUltimaAtualizacao(LocalDateTime.now());
        estoque.save();

        return salvo;
    }

    private static Alimento mapRow(ResultSet rs) throws SQLException {
        Alimento a = new Alimento();
        a.setId(rs.getInt("id_alimento"));
        a.setNome(rs.getString("nome"));
        a.setDescricao(rs.getString("descricao"));
        String unidade = rs.getString("unidade_medida");
        if (unidade != null) {
            try { a.setUnidadeMedida(UnidadeMedida.valueOf(unidade)); } catch (IllegalArgumentException e) {}
        }
        a.setDataVencimento(rs.getObject("data_vencimento", LocalDate.class));
        a.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));
        return a;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public CategoriaAlimento getCategoria() { return categoria; }
    public void setCategoria(CategoriaAlimento categoria) { this.categoria = categoria; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public UnidadeMedida getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(UnidadeMedida unidadeMedida) { this.unidadeMedida = unidadeMedida; }
    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
