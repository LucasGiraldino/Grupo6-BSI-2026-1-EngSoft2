package com.sigaac.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ParametrizacaoOngRequestDTO {
    @NotBlank(message = "Razão social é obrigatória")
    @Size(max = 150)
    private String razaoSocial;

    @Size(max = 150)
    private String nomeFantasia;

    @NotBlank(message = "CNPJ é obrigatório")
    @Size(max = 14, min = 14)
    private String cnpj;

    @Size(max = 20)
    private String telefone;

    @Size(max = 150)
    private String email;

    @Size(max = 150)
    private String site;

    private EnderecoDTO endereco;

    @Size(max = 255)
    private String logoUrl;

    private LocalDate dataFundacao;

    private String observacoes;

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }
    public EnderecoDTO getEndereco() { return endereco; }
    public void setEndereco(EnderecoDTO endereco) { this.endereco = endereco; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public LocalDate getDataFundacao() { return dataFundacao; }
    public void setDataFundacao(LocalDate dataFundacao) { this.dataFundacao = dataFundacao; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
