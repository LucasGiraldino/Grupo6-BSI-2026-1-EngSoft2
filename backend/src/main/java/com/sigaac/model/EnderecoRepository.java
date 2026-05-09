package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class EnderecoRepository extends BaseRepository {

    public EnderecoRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public Optional<Endereco> findById(Integer id) {
        return querySingle(
            "SELECT * FROM enderecos WHERE id_endereco = ?",
            this::mapRow, id);
    }

    public Endereco save(Endereco endereco) {
        if (endereco.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO enderecos (cep, logradouro, numero, complemento, bairro, cidade, estado, pais, descricao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                endereco.getCep(), endereco.getLogradouro(), endereco.getNumero(),
                endereco.getComplemento(), endereco.getBairro(), endereco.getCidade(),
                endereco.getEstado(), endereco.getPais(), endereco.getDescricao());
            if (id != null) endereco.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE enderecos SET cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, pais = ?, descricao = ? WHERE id_endereco = ?",
                endereco.getCep(), endereco.getLogradouro(), endereco.getNumero(),
                endereco.getComplemento(), endereco.getBairro(), endereco.getCidade(),
                endereco.getEstado(), endereco.getPais(), endereco.getDescricao(),
                endereco.getId());
        }
        return endereco;
    }

    private Endereco mapRow(ResultSet rs) throws SQLException {
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
}
