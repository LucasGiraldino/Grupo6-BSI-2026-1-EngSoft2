package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class ProfissionalRepository extends BaseRepository {

    public ProfissionalRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public List<Profissional> findAll() {
        return findAll(null, null);
    }

    public List<Profissional> findAll(String nome, String especialidade) {
        String sql = "SELECT p.*, u.nome AS usuario_nome FROM profissionais p " +
            "JOIN users u ON p.id_usuario = u.id_usuario WHERE 1=1";
        java.util.List<Object> params = new java.util.ArrayList<>();
        if (nome != null && !nome.isBlank()) {
            sql += " AND u.nome ILIKE ?";
            params.add("%" + nome.trim() + "%");
        }
        if (especialidade != null && !especialidade.isBlank()) {
            sql += " AND p.especialidade ILIKE ?";
            params.add("%" + especialidade.trim() + "%");
        }
        sql += " ORDER BY u.nome";
        return queryList(sql, this::mapRow, params.toArray());
    }

    public Optional<Profissional> findById(Integer id) {
        return querySingle(
            "SELECT p.*, u.nome AS usuario_nome FROM profissionais p " +
            "JOIN users u ON p.id_usuario = u.id_usuario " +
            "WHERE p.id_profissional = ?",
            this::mapRow, id);
    }

    public Profissional save(Profissional p) {
        if (p.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO profissionais (id_usuario, id_endereco, especialidade, registro_profissional, data_admissao) VALUES (?, ?, ?, ?, ?)",
                p.getUsuario() != null ? p.getUsuario().getId() : null,
                p.getEndereco() != null ? p.getEndereco().getId() : null,
                p.getEspecialidade(), p.getRegistroProfissional(), p.getDataAdmissao());
            if (id != null) p.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE profissionais SET id_usuario = ?, id_endereco = ?, especialidade = ?, registro_profissional = ?, data_admissao = ? WHERE id_profissional = ?",
                p.getUsuario() != null ? p.getUsuario().getId() : null,
                p.getEndereco() != null ? p.getEndereco().getId() : null,
                p.getEspecialidade(), p.getRegistroProfissional(), p.getDataAdmissao(),
                p.getId());
        }
        return p;
    }

    public void deleteById(Integer id) {
        executeUpdate("UPDATE profissionais SET data_demissao = NOW() WHERE id_profissional = ?", id);
    }

    private Profissional mapRow(ResultSet rs) throws SQLException {
        Profissional p = new Profissional();
        p.setId(rs.getInt("id_profissional"));
        p.setEspecialidade(rs.getString("especialidade"));
        p.setRegistroProfissional(rs.getString("registro_profissional"));
        p.setDataAdmissao(rs.getObject("data_admissao", java.time.LocalDate.class));
        p.setDataDemissao(rs.getObject("data_demissao", java.time.LocalDate.class));
        
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        // Se a query de findAll ou findById retornou usuario_nome, preenche
        try {
            u.setNome(rs.getString("usuario_nome"));
        } catch (SQLException e) {
            // Ignora se a coluna nao existir
        }
        p.setUsuario(u);
        return p;
    }
}
