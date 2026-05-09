package com.sigaac.model;

public class CepResponseDTO {
    private boolean valido;
    private String cep;
    private String logradouro;
    private String complemento;
    private String bairro;
    private String localidade;
    private String uf;
    private String mensagem;

    public boolean isValido() { return valido; }
    public void setValido(boolean valido) { this.valido = valido; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getLocalidade() { return localidade; }
    public void setLocalidade(String localidade) { this.localidade = localidade; }
    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public static CepResponseDTO invalido(String cep, String mensagem) {
        CepResponseDTO dto = new CepResponseDTO();
        dto.setValido(false);
        dto.setCep(cep);
        dto.setMensagem(mensagem);
        return dto;
    }

    public static CepResponseDTO valido(String cep, String logradouro, String complemento,
                                         String bairro, String localidade, String uf) {
        CepResponseDTO dto = new CepResponseDTO();
        dto.setValido(true);
        dto.setCep(cep);
        dto.setLogradouro(logradouro);
        dto.setComplemento(complemento);
        dto.setBairro(bairro);
        dto.setLocalidade(localidade);
        dto.setUf(uf);
        return dto;
    }
}
