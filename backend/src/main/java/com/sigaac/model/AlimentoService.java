package com.sigaac.model;

import java.time.LocalDateTime;

public class AlimentoService {

    private final AlimentoRepository alimentoRepo;
    private final EstoqueRepository estoqueRepo;

    public AlimentoService(AlimentoRepository alimentoRepo, EstoqueRepository estoqueRepo) {
        this.alimentoRepo = alimentoRepo;
        this.estoqueRepo = estoqueRepo;
    }

    public Alimento criar(Alimento alimento) {
        Alimento salvo = alimentoRepo.save(alimento);

        Estoque estoque = new Estoque();
        estoque.setAlimento(salvo);
        estoque.setQuantidadeAtual(java.math.BigDecimal.ZERO);
        estoque.setQuantidadeMinima(java.math.BigDecimal.ZERO);
        estoque.setDataUltimaAtualizacao(LocalDateTime.now());
        estoqueRepo.save(estoque);

        return salvo;
    }
}
