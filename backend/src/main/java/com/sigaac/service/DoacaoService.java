package com.sigaac.service;

import com.sigaac.dto.DoacaoRequestDTO;
import com.sigaac.model.*;
import com.sigaac.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class DoacaoService {

    @Autowired
    private DoacaoRepository doacaoRepository;

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Transactional
    public Doacao efetuarDoacao(DoacaoRequestDTO dto) {

        Paciente paciente = pacienteRepository.findById(dto.getIdPaciente())
                .orElseThrow(() -> new IllegalArgumentException("Paciente não cadastrado."));

        Profissional profissional = profissionalRepository.findById(dto.getIdProfissional())
                .orElseThrow(() -> new IllegalArgumentException("Profissional não cadastrado ou não autenticado."));

        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new IllegalArgumentException("A doação precisa conter pelo menos um alimento.");
        }

        Doacao doacao = new Doacao();
        doacao.setPaciente(paciente);
        doacao.setProfissional(profissional);
        doacao.setDataDoacao(LocalDateTime.now());
        doacao.setObservacoes(dto.getObservacoes());
        doacao.setItens(new ArrayList<>());

        for (DoacaoRequestDTO.ItemDoacaoRequestDTO itemDto : dto.getItens()) {

            // Busca o registro de estoque pelo id_alimento associado
            Estoque estoque = estoqueRepository.findByAlimentoId(itemDto.getIdAlimento())
                    .orElseThrow(() -> new IllegalArgumentException("Estoque não localizado para o alimento informado."));

            // Valida se a quantidade solicitada está disponível
            if (estoque.getQuantidadeAtual().compareTo(itemDto.getQuantidade()) < 0) {
                throw new IllegalStateException("Estoque insuficiente para o alimento: " + estoque.getAlimento().getNome());
            }

            // Atualiza e salva o saldo no estoque do alimento
            estoque.setQuantidadeAtual(estoque.getQuantidadeAtual().subtract(itemDto.getQuantidade()));
            estoque.setDataUltimaAtualizacao(LocalDateTime.now());
            estoqueRepository.save(estoque);

            // Cria o item da doação apontando para a entidade Alimento
            ItemDoacao itemDoacao = new ItemDoacao();
            itemDoacao.setDoacao(doacao);
            itemDoacao.setAlimento(estoque.getAlimento());
            itemDoacao.setQuantidade(itemDto.getQuantidade());
            itemDoacao.setPeso(null); // Define null por padrão ou calcule se aplicável

            doacao.getItens().add(itemDoacao);
        }

        return doacaoRepository.save(doacao);
    }
}