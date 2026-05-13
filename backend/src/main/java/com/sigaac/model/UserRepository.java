package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UserRepository extends BaseRepository {

    public UserRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
    }

    public Optional<User> findByEmail(String email) {
        return querySingle(
            "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
            this::mapRow, email);
    }

    public Optional<User> findByCpf(String cpf) {
        return querySingle(
            "SELECT * FROM users WHERE cpf = ? AND deleted_at IS NULL",
            this::mapRow, cpf);
    }

    public Optional<User> findById(Integer id) {
        return querySingle(
            "SELECT * FROM users WHERE id_usuario = ? AND deleted_at IS NULL",
            this::mapRow, id);
    }

    public List<User> findAll() {
        return findAll(null, null);
    }

    public List<User> findAll(String nome, String perfil) {
        String sql = "SELECT * FROM users WHERE deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (nome != null && !nome.isBlank()) {
            sql += " AND (nome ILIKE ? OR email ILIKE ?)";
            String pattern = "%" + nome.trim() + "%";
            params.add(pattern);
            params.add(pattern);
        }
        if (perfil != null && !perfil.isBlank()) {
            sql += " AND perfil = ?";
            params.add(perfil);
        }
        sql += " ORDER BY id_usuario";
        return queryList(sql, this::mapRow, params.toArray());
    }

    public long count() {
        return querySingle("SELECT COUNT(*) FROM users WHERE deleted_at IS NULL",
            rs -> rs.getLong(1)).orElse(0L);
    }

    public long countByPerfil(String perfil) {
        return querySingle(
            "SELECT COUNT(*) FROM users WHERE perfil = ? AND deleted_at IS NULL AND ativo = true",
            rs -> rs.getLong(1), perfil).orElse(0L);
    }

    public User save(User user) {
        if (user.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO users (nome, cpf, email, senha_hash, perfil, data_cadastro, ativo, id_parametrizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                user.getNome(), user.getCpf(), user.getEmail(), user.getSenhaHash(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getDataCadastro(), user.getAtivo() != null ? user.getAtivo() : true,
                user.getParametrizacaoId());
            if (id != null) user.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE users SET nome = ?, cpf = ?, email = ?, senha_hash = ?, perfil = ?, failed_attempts = ?, locked_until = ?, ativo = ?, id_parametrizacao = ? WHERE id_usuario = ?",
                user.getNome(), user.getCpf(), user.getEmail(), user.getSenhaHash(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getFailedAttempts(), user.getLockedUntil(),
                user.getAtivo(), user.getParametrizacaoId(),
                user.getId());
        }
        return user;
    }

    public void deleteById(Integer id) {
        executeUpdate("UPDATE users SET deleted_at = NOW(), ativo = false WHERE id_usuario = ?", id);
    }

    private User mapRow(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id_usuario"));
        user.setNome(rs.getString("nome"));
        user.setCpf(rs.getString("cpf"));
        user.setEmail(rs.getString("email"));
        user.setSenhaHash(rs.getString("senha_hash"));
        String role = rs.getString("perfil");
        if (role != null) {
            try { user.setPerfil(UserRole.valueOf(role)); } catch (IllegalArgumentException e) {}
        }
        user.setDataCadastro(rs.getObject("data_cadastro", java.time.LocalDate.class));
        user.setDeletedAt(rs.getObject("deleted_at", java.time.LocalDateTime.class));
        user.setLockedUntil(rs.getObject("locked_until", java.time.LocalDateTime.class));
        user.setFailedAttempts(rs.getObject("failed_attempts", Integer.class));
        user.setAtivo(rs.getObject("ativo", Boolean.class));
        user.setParametrizacaoId(rs.getObject("id_parametrizacao", Integer.class));
        return user;
    }
}
