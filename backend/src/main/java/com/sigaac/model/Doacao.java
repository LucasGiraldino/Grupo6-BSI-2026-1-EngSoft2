package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Doacao {

    private Integer id;
    private Profissional profissional;
    private Paciente paciente;
    private LocalDateTime dataDoacao;
    private String observacoes;
    private List<ItemDoacao> itens = new ArrayList<>();

    public Doacao() {}

    public Doacao(Integer id, Profissional profissional, Paciente paciente,
                  LocalDateTime dataDoacao, String observacoes, List<ItemDoacao> itens) {
        this.id = id;
        this.profissional = profissional;
        this.paciente = paciente;
        this.dataDoacao = dataDoacao;
        this.observacoes = observacoes;
        this.itens = itens;
    }

    // -- Persistence --

    public static List<Doacao> findAll() { return findAll(null, null, null); }

    public static List<Doacao> findAll(String nomePaciente, String dataInicio, String dataFim) {
        var db = DatabaseHelper.getInstance();
        String sql = "SELECT d.* FROM doacoes d " +
            "LEFT JOIN pacientes p ON d.id_paciente = p.id_paciente WHERE 1=1";
        List<Object> params = new ArrayList<>();
        if (nomePaciente != null && !nomePaciente.isBlank()) {
            sql += " AND p.nome ILIKE ?";
            params.add("%" + nomePaciente.trim() + "%");
        }
        if (dataInicio != null && !dataInicio.isBlank()) {
            sql += " AND d.data_doacao >= ?::timestamp";
            params.add(dataInicio);
        }
        if (dataFim != null && !dataFim.isBlank()) {
            sql += " AND d.data_doacao <= ?::timestamp";
            params.add(dataFim);
        }
        sql += " ORDER BY d.data_doacao DESC";
        return db.queryList(sql, Doacao::mapRow, params.toArray());
    }

    public static Optional<Doacao> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM doacoes WHERE id_doacao = ?", Doacao::mapRow, id);
    }

    public Doacao save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO doacoes (id_profissional, id_paciente, data_doacao, observacoes) VALUES (?, ?, ?, ?)",
                this.profissional != null ? this.profissional.getId() : null,
                this.paciente != null ? this.paciente.getId() : null,
                this.dataDoacao, this.observacoes);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE doacoes SET id_profissional = ?, id_paciente = ?, data_doacao = ?, observacoes = ? WHERE id_doacao = ?",
                this.profissional != null ? this.profissional.getId() : null,
                this.paciente != null ? this.paciente.getId() : null,
                this.dataDoacao, this.observacoes, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate("DELETE FROM doacoes WHERE id_doacao = ?", this.id);
    }

    public Doacao merge(Doacao request) {
        if (request.getPaciente() != null) this.paciente = request.getPaciente();
        if (request.getObservacoes() != null) this.observacoes = request.getObservacoes();
        return this;
    }

    /**
     * Efetua uma doacao com transacao envolvendo Doacao + Estoque + ItemDoacao.
     */
    public static Doacao efetuar(Integer idPaciente, Integer idProfissional,
                                  String observacoes, List<ItemDoacaoRequest> itens) {
        var db = DatabaseHelper.getInstance();

        Paciente paciente = Paciente.findById(idPaciente)
            .orElseThrow(() -> new IllegalArgumentException("Paciente nao cadastrado."));

        Profissional profissional = Profissional.findById(idProfissional)
            .orElseThrow(() -> new IllegalArgumentException("Profissional nao cadastrado ou nao autenticado."));

        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("A doacao precisa conter pelo menos um alimento.");
        }

        Doacao doacao = new Doacao();
        doacao.setPaciente(paciente);
        doacao.setProfissional(profissional);
        doacao.setDataDoacao(LocalDateTime.now());
        doacao.setObservacoes(observacoes);
        doacao.setItens(new ArrayList<>());

        db.executeInTransaction(conn -> {
            doacao.save();

            for (ItemDoacaoRequest itemDto : itens) {
                Alimento alimento = Alimento.findById(itemDto.getIdAlimento())
                    .orElseThrow(() -> new IllegalArgumentException("Alimento nao encontrado."));

                try (PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO itens_doacao (id_doacao, id_alimento, quantidade, peso) VALUES (?, ?, ?, ?)",
                        Statement.RETURN_GENERATED_KEYS)) {
                    stmt.setInt(1, doacao.getId());
                    stmt.setInt(2, alimento.getId());
                    stmt.setBigDecimal(3, itemDto.getQuantidade());
                    stmt.setNull(4, java.sql.Types.DECIMAL);
                    stmt.executeUpdate();
                }

                ItemDoacao itemDoacao = new ItemDoacao();
                itemDoacao.setDoacao(doacao);
                itemDoacao.setAlimento(alimento);
                itemDoacao.setQuantidade(itemDto.getQuantidade());
                doacao.getItens().add(itemDoacao);
            }
        });

        return doacao;
    }

    private static Doacao mapRow(ResultSet rs) throws SQLException {
        Doacao d = new Doacao();
        d.setId(rs.getInt("id_doacao"));
        Integer idProf = rs.getObject("id_profissional", Integer.class);
        if (idProf != null) d.setProfissional(Profissional.findById(idProf).orElse(null));
        Integer idPac = rs.getObject("id_paciente", Integer.class);
        if (idPac != null) d.setPaciente(Paciente.findById(idPac).orElse(null));
        d.setDataDoacao(rs.getObject("data_doacao", LocalDateTime.class));
        d.setObservacoes(rs.getString("observacoes"));
        return d;
    }

    // -- Inner class for request --

    public static class ItemDoacaoRequest {
        private Integer idAlimento;
        private java.math.BigDecimal quantidade;

        public ItemDoacaoRequest() {}
        public ItemDoacaoRequest(Integer idAlimento, java.math.BigDecimal quantidade) {
            this.idAlimento = idAlimento;
            this.quantidade = quantidade;
        }
        public Integer getIdAlimento() { return idAlimento; }
        public void setIdAlimento(Integer idAlimento) { this.idAlimento = idAlimento; }
        public java.math.BigDecimal getQuantidade() { return quantidade; }
        public void setQuantidade(java.math.BigDecimal quantidade) { this.quantidade = quantidade; }
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public LocalDateTime getDataDoacao() { return dataDoacao; }
    public void setDataDoacao(LocalDateTime dataDoacao) { this.dataDoacao = dataDoacao; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public List<ItemDoacao> getItens() { return itens; }
    public void setItens(List<ItemDoacao> itens) { this.itens = itens; }
}
