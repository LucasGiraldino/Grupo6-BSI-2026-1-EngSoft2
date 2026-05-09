package com.sigaac.model;

public class CnpjResponseDTO {
    private boolean valido;
    private String cnpj;
    private String razaoSocial;
    private String nomeFantasia;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String municipio;
    private String uf;
    private String cep;
    private String telefone;
    private String email;
    private String mensagem;

    public boolean isValido() { return valido; }
    public void setValido(boolean valido) { this.valido = valido; }
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }
    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }
    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public static CnpjResponseDTO invalido(String cnpj, String mensagem) {
        CnpjResponseDTO dto = new CnpjResponseDTO();
        dto.setValido(false);
        dto.setCnpj(cnpj);
        dto.setMensagem(mensagem);
        return dto;
    }

    public static CnpjResponseDTO valido(String cnpj, String razaoSocial, String nomeFantasia,
                                          String logradouro, String numero, String complemento,
                                          String bairro, String municipio, String uf,
                                          String cep, String telefone, String email) {
        CnpjResponseDTO dto = new CnpjResponseDTO();
        dto.setValido(true);
        dto.setCnpj(cnpj);
        dto.setRazaoSocial(razaoSocial);
        dto.setNomeFantasia(nomeFantasia);
        dto.setLogradouro(logradouro);
        dto.setNumero(numero);
        dto.setComplemento(complemento);
        dto.setBairro(bairro);
        dto.setMunicipio(municipio);
        dto.setUf(uf);
        dto.setCep(cep);
        dto.setTelefone(telefone);
        dto.setEmail(email);
        return dto;
    }
}
