package com.sigaac.model;

public class ProfissionalCompraId {
    private Integer profissional;
    private Integer compra;

    public ProfissionalCompraId() {}

    public ProfissionalCompraId(Integer profissional, Integer compra) {
        this.profissional = profissional;
        this.compra = compra;
    }

    public Integer getProfissional() { return profissional; }
    public void setProfissional(Integer profissional) { this.profissional = profissional; }
    public Integer getCompra() { return compra; }
    public void setCompra(Integer compra) { this.compra = compra; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProfissionalCompraId that = (ProfissionalCompraId) o;
        return java.util.Objects.equals(profissional, that.profissional) &&
               java.util.Objects.equals(compra, that.compra);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(profissional, compra);
    }
}
