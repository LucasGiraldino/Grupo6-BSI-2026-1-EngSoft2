package com.sigaac.model;

import lombok.*;
import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfissionalCompraId implements Serializable {
    private Integer profissional;
    private Integer compra;

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