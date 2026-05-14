package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class User {

    private Integer id;
    private String nome;
    private String cpf;
    private String email;
    private String senhaHash;
    private UserRole role;
    private LocalDate dataCadastro;
    private LocalDateTime deletedAt;
    private LocalDateTime lockedUntil;
    private Integer failedAttempts = 0;
    private Boolean ativo = true;
    private Integer parametrizacaoId;

    public User() {}

    public User(Integer id, String nome, String cpf, String email, String senhaHash,
                UserRole role, LocalDate dataCadastro) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senhaHash = senhaHash;
        this.role = role;
        this.dataCadastro = dataCadastro;
    }

    // -- Persistence --

    public static Optional<User> findByEmail(String email) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
            User::mapRow, email);
    }

    public static Optional<User> findByCpf(String cpf) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM users WHERE cpf = ? AND deleted_at IS NULL",
            User::mapRow, cpf);
    }

    public static Optional<User> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT * FROM users WHERE id_usuario = ? AND deleted_at IS NULL",
            User::mapRow, id);
    }

    public static List<User> findAll() { return findAll(null, null); }

    public static List<User> findAll(String nome, String perfil) {
        var db = DatabaseHelper.getInstance();
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
        return db.queryList(sql, User::mapRow, params.toArray());
    }

    public static long count() {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT COUNT(*) FROM users WHERE deleted_at IS NULL",
            rs -> rs.getLong(1)).orElse(0L);
    }

    public static long countByPerfil(String perfil) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT COUNT(*) FROM users WHERE perfil = ? AND deleted_at IS NULL AND ativo = true",
            rs -> rs.getLong(1), perfil).orElse(0L);
    }

    public User save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO users (nome, cpf, email, senha_hash, perfil, data_cadastro, ativo, id_parametrizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                this.nome, this.cpf, this.email, this.senhaHash,
                this.role != null ? this.role.name() : null,
                this.dataCadastro, this.ativo != null ? this.ativo : true,
                this.parametrizacaoId);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE users SET nome = ?, cpf = ?, email = ?, senha_hash = ?, perfil = ?, failed_attempts = ?, locked_until = ?, ativo = ?, id_parametrizacao = ? WHERE id_usuario = ?",
                this.nome, this.cpf, this.email, this.senhaHash,
                this.role != null ? this.role.name() : null,
                this.failedAttempts, this.lockedUntil,
                this.ativo, this.parametrizacaoId,
                this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate(
            "UPDATE users SET deleted_at = NOW(), ativo = false WHERE id_usuario = ?", id);
    }

    private static User mapRow(ResultSet rs) throws SQLException {
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
        user.setDataCadastro(rs.getObject("data_cadastro", LocalDate.class));
        user.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));
        user.setLockedUntil(rs.getObject("locked_until", LocalDateTime.class));
        user.setFailedAttempts(rs.getObject("failed_attempts", Integer.class));
        user.setAtivo(rs.getObject("ativo", Boolean.class));
        user.setParametrizacaoId(rs.getObject("id_parametrizacao", Integer.class));
        return user;
    }

    // -- Auth helpers --

    public boolean isAccountNonLocked() {
        return lockedUntil == null || LocalDateTime.now().isAfter(lockedUntil);
    }

    public void incrementFailedAttempts() {
        this.failedAttempts++;
        if (this.failedAttempts >= 5) {
            this.lockedUntil = LocalDateTime.now().plusMinutes(15);
        }
    }

    public void resetFailedAttempts() {
        this.failedAttempts = 0;
        this.lockedUntil = null;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }
    public String getPerfil() { return role != null ? role.getRole() : null; }
    public void setPerfil(UserRole role) { this.role = role; }
    public UserRole getRole() { return role; }
    public LocalDate getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDate dataCadastro) { this.dataCadastro = dataCadastro; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }
    public Integer getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(Integer failedAttempts) { this.failedAttempts = failedAttempts; }
    public Integer getParametrizacaoId() { return parametrizacaoId; }
    public void setParametrizacaoId(Integer parametrizacaoId) { this.parametrizacaoId = parametrizacaoId; }
}
