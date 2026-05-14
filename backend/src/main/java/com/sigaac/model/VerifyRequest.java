package com.sigaac.model;

public class VerifyRequest {
    private String email;
    private String senha;
    private String codigo;

    public VerifyRequest() {}
    public VerifyRequest(String email, String senha, String codigo) {
        this.email = email;
        this.senha = senha;
        this.codigo = codigo;
    }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
}
