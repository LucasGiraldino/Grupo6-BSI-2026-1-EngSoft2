package com.sigaac.model;

public record CpfResponse(
    boolean valido,
    String cpf,
    String nome,
    String dataNascimento,
    String sexo,
    String mensagem
) {
    public static CpfResponse invalido(String cpf, String mensagem) {
        return new CpfResponse(false, cpf, null, null, null, mensagem);
    }
    public static CpfResponse mock(String cpf, String nome, String dataNascimento, String sexo) {
        return new CpfResponse(true, cpf, nome, dataNascimento, sexo, null);
    }
    public static CpfResponse api(String cpf, String nome, String dataNascimento, String sexo) {
        return new CpfResponse(true, cpf, nome, dataNascimento, sexo, null);
    }
}
