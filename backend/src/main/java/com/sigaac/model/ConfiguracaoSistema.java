package com.sigaac.model;

public class ConfiguracaoSistema {
    private Boolean parametrizacaoExiste;
    private Boolean usuarioEhAdministrador;
    private ParametrizacaoOngResponse parametrizacao;

    public Boolean getParametrizacaoExiste() { return parametrizacaoExiste; }
    public void setParametrizacaoExiste(Boolean parametrizacaoExiste) { this.parametrizacaoExiste = parametrizacaoExiste; }
    public Boolean getUsuarioEhAdministrador() { return usuarioEhAdministrador; }
    public void setUsuarioEhAdministrador(Boolean usuarioEhAdministrador) { this.usuarioEhAdministrador = usuarioEhAdministrador; }
    public ParametrizacaoOngResponse getParametrizacao() { return parametrizacao; }
    public void setParametrizacao(ParametrizacaoOngResponse parametrizacao) { this.parametrizacao = parametrizacao; }
}
