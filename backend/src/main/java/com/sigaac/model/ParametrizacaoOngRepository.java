package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class ParametrizacaoOngRepository extends BaseRepository {

    private final EnderecoRepository enderecoRepo;

    public ParametrizacaoOngRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
        this.enderecoRepo = new EnderecoRepository(ds);
    }

    public List<ParametrizacaoOng> findAll() {
        return queryList(
            "SELECT * FROM parametrizacao_ong ORDER BY id_parametrizacao",
            this::mapRow);
    }

    public Optional<ParametrizacaoOng> findById(Integer id) {
        return querySingle(
            "SELECT * FROM parametrizacao_ong WHERE id_parametrizacao = ?",
            this::mapRow, id);
    }

    public Optional<ParametrizacaoOng> findFirst() {
        return querySingle(
            "SELECT * FROM parametrizacao_ong ORDER BY id_parametrizacao LIMIT 1",
            this::mapRow);
    }

    public ParametrizacaoOng save(ParametrizacaoOng param) {
        if (param.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO parametrizacao_ong (razao_social, nome_fantasia, cnpj, telefone, email, site, id_endereco, logo_url, data_fundacao, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                param.getRazaoSocial(), param.getNomeFantasia(), param.getCnpj(),
                param.getTelefone(), param.getEmail(), param.getSite(),
                param.getEndereco() != null ? param.getEndereco().getId() : null,
                param.getLogoUrl(), param.getDataFundacao(), param.getObservacoes());
            if (id != null) param.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE parametrizacao_ong SET razao_social = ?, nome_fantasia = ?, cnpj = ?, telefone = ?, email = ?, site = ?, id_endereco = ?, logo_url = ?, data_fundacao = ?, observacoes = ? WHERE id_parametrizacao = ?",
                param.getRazaoSocial(), param.getNomeFantasia(), param.getCnpj(),
                param.getTelefone(), param.getEmail(), param.getSite(),
                param.getEndereco() != null ? param.getEndereco().getId() : null,
                param.getLogoUrl(), param.getDataFundacao(), param.getObservacoes(),
                param.getId());
        }
        return param;
    }

    public void delete(Integer id) {
        executeUpdate("DELETE FROM parametrizacao_ong WHERE id_parametrizacao = ?", id);
    }

    private ParametrizacaoOng mapRow(ResultSet rs) throws SQLException {
        ParametrizacaoOng p = new ParametrizacaoOng();
        p.setId(rs.getInt("id_parametrizacao"));
        p.setRazaoSocial(rs.getString("razao_social"));
        p.setNomeFantasia(rs.getString("nome_fantasia"));
        p.setCnpj(rs.getString("cnpj"));
        p.setTelefone(rs.getString("telefone"));
        p.setEmail(rs.getString("email"));
        p.setSite(rs.getString("site"));
        p.setLogoUrl(rs.getString("logo_url"));
        p.setDataFundacao(rs.getObject("data_fundacao", java.time.LocalDate.class));
        p.setObservacoes(rs.getString("observacoes"));
        Integer idEndereco = rs.getObject("id_endereco", Integer.class);
        if (idEndereco != null) {
            p.setEndereco(enderecoRepo.findById(idEndereco).orElse(null));
        }
        return p;
    }
}
