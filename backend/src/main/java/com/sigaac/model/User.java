package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
}
