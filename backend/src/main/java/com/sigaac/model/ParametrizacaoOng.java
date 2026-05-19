package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class ParametrizacaoOng {

    private Integer id;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private String telefone;
    private String email;
    private String site;
    private Endereco endereco;
    private String logoUrl;
    private LocalDate dataFundacao;
    private String observacoes;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }
    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public LocalDate getDataFundacao() { return dataFundacao; }
    public void setDataFundacao(LocalDate dataFundacao) { this.dataFundacao = dataFundacao; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    // -- Persistence --

    public static List<ParametrizacaoOng> findAll() {
        return DatabaseManager.getInstance().queryList(
            "SELECT * FROM parametrizacao_ong ORDER BY id_parametrizacao",
            ParametrizacaoOng::mapRow);
    }

    public static Optional<ParametrizacaoOng> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM parametrizacao_ong WHERE id_parametrizacao = ?",
            ParametrizacaoOng::mapRow, id);
    }

    public static Optional<ParametrizacaoOng> findFirst() {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM parametrizacao_ong ORDER BY id_parametrizacao LIMIT 1",
            ParametrizacaoOng::mapRow);
    }

    public ParametrizacaoOng save() {
        var db = DatabaseManager.getInstance();
        if (this.endereco != null) {
            Endereco saved = this.endereco.save();
            this.endereco = saved;
        }
        Integer idEndereco = this.endereco != null ? this.endereco.getId() : null;

        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO parametrizacao_ong (razao_social, nome_fantasia, cnpj, telefone, email, site, id_endereco, logo_url, data_fundacao, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                this.razaoSocial, this.nomeFantasia, this.cnpj,
                this.telefone, this.email, this.site,
                idEndereco,
                this.logoUrl, this.dataFundacao, this.observacoes);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE parametrizacao_ong SET razao_social = ?, nome_fantasia = ?, cnpj = ?, telefone = ?, email = ?, site = ?, id_endereco = ?, logo_url = ?, data_fundacao = ?, observacoes = ? WHERE id_parametrizacao = ?",
                this.razaoSocial, this.nomeFantasia, this.cnpj,
                this.telefone, this.email, this.site,
                idEndereco,
                this.logoUrl, this.dataFundacao, this.observacoes,
                this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "DELETE FROM parametrizacao_ong WHERE id_parametrizacao = ?", this.id);
    }

    private static ParametrizacaoOng mapRow(ResultSet rs) throws SQLException {
        ParametrizacaoOng p = new ParametrizacaoOng();
        p.setId(rs.getInt("id_parametrizacao"));
        p.setRazaoSocial(rs.getString("razao_social"));
        p.setNomeFantasia(rs.getString("nome_fantasia"));
        p.setCnpj(rs.getString("cnpj"));
        p.setTelefone(rs.getString("telefone"));
        p.setEmail(rs.getString("email"));
        p.setSite(rs.getString("site"));
        p.setLogoUrl(rs.getString("logo_url"));
        p.setDataFundacao(rs.getObject("data_fundacao", LocalDate.class));
        p.setObservacoes(rs.getString("observacoes"));
        Integer idEndereco = rs.getObject("id_endereco", Integer.class);
        if (idEndereco != null) {
            p.setEndereco(Endereco.findById(idEndereco).orElse(null));
        }
        return p;
    }
}
