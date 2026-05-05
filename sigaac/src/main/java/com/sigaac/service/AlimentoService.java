package com.sigaac.service;

import com.sigaac.model.Alimento;
import com.sigaac.model.Estoque;
import com.sigaac.repository.AlimentoRepository;
import com.sigaac.repository.EstoqueRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AlimentoService {

    @Autowired
    private AlimentoRepository alimentoRepository;

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Transactional
    public Alimento criar(Alimento alimento) {
        Alimento salvo = alimentoRepository.save(alimento);

        Estoque estoque = new Estoque();
        estoque.setAlimento(salvo);
        estoque.setDataUltimaAtualizacao(LocalDateTime.now());
        estoqueRepository.save(estoque);

        return salvo;
    }
}
