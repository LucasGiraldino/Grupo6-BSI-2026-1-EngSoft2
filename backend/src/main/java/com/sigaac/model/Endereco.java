package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class Endereco {

    private Integer id;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private String pais = "Brasil";
    private String descricao;

    public Endereco() {}

    public Endereco(Integer id, String cep, String logradouro, String numero, String complemento,
                    String bairro, String cidade, String estado, String pais, String descricao) {
        this.id = id;
        this.cep = cep;
        this.logradouro = logradouro;
        this.numero = numero;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.pais = pais;
        this.descricao = descricao;
    }

    // -- Persistence --

    public static Optional<Endereco> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM enderecos WHERE id_endereco = ?",
            Endereco::mapRow, id);
    }

    public Endereco save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO enderecos (cep, logradouro, numero, complemento, bairro, cidade, estado, pais, descricao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                this.cep, this.logradouro, this.numero,
                this.complemento, this.bairro, this.cidade,
                this.estado, this.pais, this.descricao);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE enderecos SET cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, pais = ?, descricao = ? WHERE id_endereco = ?",
                this.cep, this.logradouro, this.numero,
                this.complemento, this.bairro, this.cidade,
                this.estado, this.pais, this.descricao,
                this.id);
        }
        return this;
    }

    private static Endereco mapRow(ResultSet rs) throws SQLException {
        Endereco e = new Endereco();
        e.setId(rs.getInt("id_endereco"));
        e.setCep(rs.getString("cep"));
        e.setLogradouro(rs.getString("logradouro"));
        e.setNumero(rs.getString("numero"));
        e.setComplemento(rs.getString("complemento"));
        e.setBairro(rs.getString("bairro"));
        e.setCidade(rs.getString("cidade"));
        e.setEstado(rs.getString("estado"));
        e.setPais(rs.getString("pais"));
        e.setDescricao(rs.getString("descricao"));
        return e;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
