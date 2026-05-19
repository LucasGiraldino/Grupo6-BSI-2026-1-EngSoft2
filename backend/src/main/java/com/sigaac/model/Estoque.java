package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class Estoque {

    private Integer id;
    private Alimento alimento;
    private BigDecimal quantidadeAtual = BigDecimal.ZERO;
    private BigDecimal quantidadeMinima = BigDecimal.ZERO;
    private LocalDateTime dataUltimaAtualizacao;

    public Estoque() {}

    public Estoque(Integer id, Alimento alimento, BigDecimal quantidadeAtual, BigDecimal quantidadeMinima, LocalDateTime dataUltimaAtualizacao) {
        this.id = id;
        this.alimento = alimento;
        this.quantidadeAtual = quantidadeAtual;
        this.quantidadeMinima = quantidadeMinima;
        this.dataUltimaAtualizacao = dataUltimaAtualizacao;
    }

    // -- Persistence --

    public static List<Estoque> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT e.*, a.nome AS al_nome, a.unidade_medida AS al_unidade_medida " +
            "FROM estoque e " +
            "JOIN alimentos a ON e.id_alimento = a.id_alimento " +
            "WHERE a.deleted_at IS NULL " +
            "ORDER BY a.nome",
            Estoque::mapRowCompleto);
    }

    public static Optional<Estoque> findByAlimentoId(Integer idAlimento) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM estoque WHERE id_alimento = ?",
            Estoque::mapRow, idAlimento);
    }

    public static Optional<Estoque> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM estoque WHERE id_estoque = ?",
            Estoque::mapRow, id);
    }

    public Estoque save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO estoque (id_alimento, quantidade_atual, quantidade_minima, data_ultima_atualizacao) VALUES (?, ?, ?, ?)",
                this.alimento != null ? this.alimento.getId() : null,
                this.quantidadeAtual, this.quantidadeMinima,
                this.dataUltimaAtualizacao);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE estoque SET quantidade_atual = ?, quantidade_minima = ?, data_ultima_atualizacao = ? WHERE id_estoque = ?",
                this.quantidadeAtual, this.quantidadeMinima,
                this.dataUltimaAtualizacao, this.id);
        }
        return this;
    }

    private static Estoque mapRow(ResultSet rs) throws SQLException {
        Estoque e = new Estoque();
        e.setId(rs.getInt("id_estoque"));
        e.setQuantidadeAtual(rs.getBigDecimal("quantidade_atual"));
        e.setQuantidadeMinima(rs.getBigDecimal("quantidade_minima"));
        e.setDataUltimaAtualizacao(rs.getObject("data_ultima_atualizacao", LocalDateTime.class));
        return e;
    }

    private static Estoque mapRowCompleto(ResultSet rs) throws SQLException {
        Estoque e = mapRow(rs);
        Alimento a = new Alimento();
        a.setId(rs.getInt("id_alimento"));
        a.setNome(rs.getString("al_nome"));
        String unidade = rs.getString("al_unidade_medida");
        if (unidade != null) {
            try { a.setUnidadeMedida(UnidadeMedida.valueOf(unidade)); } catch (IllegalArgumentException ex) {}
        }
        e.setAlimento(a);
        return e;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Alimento getAlimento() { return alimento; }
    public void setAlimento(Alimento alimento) { this.alimento = alimento; }
    public BigDecimal getQuantidadeAtual() { return quantidadeAtual; }
    public void setQuantidadeAtual(BigDecimal quantidadeAtual) { this.quantidadeAtual = quantidadeAtual; }
    public BigDecimal getQuantidadeMinima() { return quantidadeMinima; }
    public void setQuantidadeMinima(BigDecimal quantidadeMinima) { this.quantidadeMinima = quantidadeMinima; }
    public LocalDateTime getDataUltimaAtualizacao() { return dataUltimaAtualizacao; }
    public void setDataUltimaAtualizacao(LocalDateTime dataUltimaAtualizacao) { this.dataUltimaAtualizacao = dataUltimaAtualizacao; }
}
