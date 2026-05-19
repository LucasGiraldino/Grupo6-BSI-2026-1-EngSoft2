package com.sigaac.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sigaac.config.CpfValidator;
import com.sigaac.config.DatabaseManager;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

public class Paciente {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private Integer id;

    @JsonIgnore
    private transient Prontuario prontuario;

    private Endereco endereco;
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private String sexo;
    private String telefone;
    private String email;
    private String restricoesAlimentares;
    private LocalDate dataCadastro;
    private Boolean ativo = true;
    private LocalDateTime deletedAt;

    public Paciente() {}

    public Paciente(Integer id, Prontuario prontuario, Endereco endereco, String nome, String cpf,
                    LocalDate dataNascimento, String sexo, String telefone, String email,
                    String restricoesAlimentares, LocalDate dataCadastro, Boolean ativo, LocalDateTime deletedAt) {
        this.id = id;
        this.prontuario = prontuario;
        this.endereco = endereco;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.telefone = telefone;
        this.email = email;
        this.restricoesAlimentares = restricoesAlimentares;
        this.dataCadastro = dataCadastro;
        this.ativo = ativo;
        this.deletedAt = deletedAt;
    }

    // -- Persistence --

    public static List<Paciente> findAll() { return findAll(null, null); }

    public static List<Paciente> findAll(String nome, String cpf) {
        var db = DatabaseManager.getInstance();
        String sql = "SELECT * FROM pacientes WHERE deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (nome != null && !nome.isBlank()) {
            sql += " AND nome ILIKE ?";
            params.add("%" + nome.trim() + "%");
        }
        if (cpf != null && !cpf.isBlank()) {
            sql += " AND cpf ILIKE ?";
            params.add("%" + cpf.trim() + "%");
        }
        sql += " ORDER BY nome";
        return db.queryList(sql, Paciente::mapRow, params.toArray());
    }

    public static Optional<Paciente> findById(Integer id) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM pacientes WHERE id_paciente = ? AND deleted_at IS NULL",
            Paciente::mapRow, id);
    }

    public static Optional<Paciente> findByCpf(String cpf) {
        return DatabaseManager.getInstance().querySingle(
            "SELECT * FROM pacientes WHERE cpf = ? AND deleted_at IS NULL",
            Paciente::mapRow, cpf);
    }

    public Paciente save() {
        var db = DatabaseManager.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO pacientes (id_endereco, nome, cpf, data_nascimento, sexo, telefone, email, restricoes_alimentares, data_cadastro, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                this.endereco != null ? this.endereco.getId() : null,
                this.nome, this.cpf, this.dataNascimento,
                this.sexo, this.telefone, this.email,
                this.restricoesAlimentares, this.dataCadastro, true);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE pacientes SET id_endereco = ?, nome = ?, cpf = ?, data_nascimento = ?, sexo = ?, telefone = ?, email = ?, restricoes_alimentares = ?, ativo = ? WHERE id_paciente = ?",
                this.endereco != null ? this.endereco.getId() : null,
                this.nome, this.cpf, this.dataNascimento,
                this.sexo, this.telefone, this.email,
                this.restricoesAlimentares, true, this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseManager.getInstance().executeUpdate(
            "UPDATE pacientes SET deleted_at = NOW() WHERE id_paciente = ?", this.id);
    }

    public void validar() throws IllegalArgumentException {
        if (this.cpf != null && !CpfValidator.validarMatematicamente(this.cpf)) {
            throw new IllegalArgumentException("CPF inválido. Verifique os dígitos.");
        }
        if (this.telefone != null && this.telefone.length() != 10
                && this.telefone.length() != 11) {
            throw new IllegalArgumentException("Telefone inválido. Deve ter 10 ou 11 dígitos.");
        }
        if (this.email != null && !this.email.isEmpty()
                && !EMAIL_PATTERN.matcher(this.email).matches()) {
            throw new IllegalArgumentException("E-mail inválido.");
        }
    }

    private static Paciente mapRow(ResultSet rs) throws SQLException {
        Paciente p = new Paciente();
        p.setId(rs.getInt("id_paciente"));
        p.setNome(rs.getString("nome"));
        p.setCpf(rs.getString("cpf"));
        p.setDataNascimento(rs.getObject("data_nascimento", LocalDate.class));
        p.setSexo(rs.getString("sexo"));
        p.setTelefone(rs.getString("telefone"));
        p.setEmail(rs.getString("email"));
        p.setRestricoesAlimentares(rs.getString("restricoes_alimentares"));
        p.setDataCadastro(rs.getObject("data_cadastro", LocalDate.class));
        p.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));
        Integer idEndereco = rs.getObject("id_endereco", Integer.class);
        if (idEndereco != null) {
            p.setEndereco(Endereco.findById(idEndereco).orElse(null));
        }
        return p;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Prontuario getProntuario() { return prontuario; }
    public void setProntuario(Prontuario prontuario) { this.prontuario = prontuario; }
    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRestricoesAlimentares() { return restricoesAlimentares; }
    public void setRestricoesAlimentares(String restricoesAlimentares) { this.restricoesAlimentares = restricoesAlimentares; }
    public LocalDate getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDate dataCadastro) { this.dataCadastro = dataCadastro; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
