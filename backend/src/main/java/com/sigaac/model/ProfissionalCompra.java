package com.sigaac.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profissionais_compras")
@IdClass(ProfissionalCompraId.class)
public class ProfissionalCompra {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_profissional", nullable = false)
    private Profissional profissional;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_compra", nullable = false)
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
