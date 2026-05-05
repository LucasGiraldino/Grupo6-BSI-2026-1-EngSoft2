package com.sigaac.dto;

public class ConfiguracaoSistemaDTO {
    private Boolean parametrizacaoExiste;
    private Boolean usuarioEhAdministrador;
    private ParametrizacaoOngDTO parametrizacao;

    public Boolean getParametrizacaoExiste() { return parametrizacaoExiste; }
    public void setParametrizacaoExiste(Boolean parametrizacaoExiste) { this.parametrizacaoExiste = parametrizacaoExiste; }
    public Boolean getUsuarioEhAdministrador() { return usuarioEhAdministrador; }
    public void setUsuarioEhAdministrador(Boolean usuarioEhAdministrador) { this.usuarioEhAdministrador = usuarioEhAdministrador; }
    public ParametrizacaoOngDTO getParametrizacao() { return parametrizacao; }
    public void setParametrizacao(ParametrizacaoOngDTO parametrizacao) { this.parametrizacao = parametrizacao; }
}
