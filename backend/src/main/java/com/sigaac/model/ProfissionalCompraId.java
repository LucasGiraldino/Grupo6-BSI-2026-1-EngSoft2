package com.sigaac.model;

import java.io.Serializable;
import java.util.Objects;

public class ProfissionalCompraId implements Serializable {
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
        return Objects.equals(profissional, that.profissional) && Objects.equals(compra, that.compra);
    }

    @Override
    public int hashCode() {
        return Objects.hash(profissional, compra);
    }
}
