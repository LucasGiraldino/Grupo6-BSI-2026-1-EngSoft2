package com.sigaac.model;

public class ProfissionalCompra {

    private Profissional profissional;
    private Compra compra;

    public ProfissionalCompra() {}

    public ProfissionalCompra(Profissional profissional, Compra compra) {
        this.profissional = profissional;
        this.compra = compra;
    }

    public Profissional getProfissional() { return profissional; }
    public void setProfissional(Profissional profissional) { this.profissional = profissional; }
    public Compra getCompra() { return compra; }
    public void setCompra(Compra compra) { this.compra = compra; }
}
