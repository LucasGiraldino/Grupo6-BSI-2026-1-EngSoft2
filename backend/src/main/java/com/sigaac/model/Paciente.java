package com.sigaac.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Paciente {

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
    private LocalDateTime deletedAt;

    public Paciente() {}

    public Paciente(Integer id, Prontuario prontuario, Endereco endereco, String nome, String cpf,
                    LocalDate dataNascimento, String sexo, String telefone, String email,
                    String restricoesAlimentares, LocalDate dataCadastro, LocalDateTime deletedAt) {
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
        this.deletedAt = deletedAt;
    }

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
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
