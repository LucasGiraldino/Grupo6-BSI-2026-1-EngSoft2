package com.sigaac.model;

public record CpfResponseDTO(
    boolean valido,
    String cpf,
    String nome,
    String dataNascimento,
    String sexo,
    String mensagem
) {
    public static CpfResponseDTO invalido(String cpf, String mensagem) {
        return new CpfResponseDTO(false, cpf, null, null, null, mensagem);
    }
    public static CpfResponseDTO mock(String cpf, String nome, String dataNascimento, String sexo) {
        return new CpfResponseDTO(true, cpf, nome, dataNascimento, sexo, null);
    }
    public static CpfResponseDTO api(String cpf, String nome, String dataNascimento, String sexo) {
        return new CpfResponseDTO(true, cpf, nome, dataNascimento, sexo, null);
    }
}
