package com.sigaac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profissionais_compras")
@IdClass(ProfissionalCompraId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfissionalCompra {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_profissional", nullable = false)
    private Profissional profissional;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_compra", nullable = false)
    private Compra compra;
}