package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class Notificacao {

    private Integer id;
    private Paciente paciente;
    private String tipo;
    private String mensagem;
    private LocalDateTime dataEnvio;
    private String statusEnvio;

    public Notificacao() {}

    public Notificacao(Integer id, Paciente paciente, String tipo, String mensagem,
                       LocalDateTime dataEnvio, String statusEnvio) {
        this.id = id;
        this.paciente = paciente;
        this.tipo = tipo;
        this.mensagem = mensagem;
        this.dataEnvio = dataEnvio;
        this.statusEnvio = statusEnvio;
    }

    // -- Persistence --

    public static List<Notificacao> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT * FROM notificacoes ORDER BY id_notificacao",
            Notificacao::mapRow);
    }

    public static Optional<Notificacao> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM notificacoes WHERE id_notificacao = ?",
            Notificacao::mapRow, id);
    }

    public Notificacao save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO notificacoes (id_paciente, tipo, mensagem, data_envio, status_envio) VALUES (?, ?, ?, ?, ?)",
                this.paciente != null ? this.paciente.getId() : null,
                this.tipo, this.mensagem, this.dataEnvio, this.statusEnvio);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE notificacoes SET id_paciente = ?, tipo = ?, mensagem = ?, data_envio = ?, status_envio = ? WHERE id_notificacao = ?",
                this.paciente != null ? this.paciente.getId() : null,
                this.tipo, this.mensagem, this.dataEnvio, this.statusEnvio, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "DELETE FROM notificacoes WHERE id_notificacao = ?", this.id);
    }

    private static Notificacao mapRow(ResultSet rs) throws SQLException {
        Notificacao n = new Notificacao();
        n.setId(rs.getInt("id_notificacao"));
        n.setTipo(rs.getString("tipo"));
        n.setMensagem(rs.getString("mensagem"));
        n.setDataEnvio(rs.getObject("data_envio", LocalDateTime.class));
        n.setStatusEnvio(rs.getString("status_envio"));
        return n;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }
    public String getStatusEnvio() { return statusEnvio; }
    public void setStatusEnvio(String statusEnvio) { this.statusEnvio = statusEnvio; }
}
