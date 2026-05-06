package com.sigaac.service;

import com.sigaac.dto.CompraDTO;
import com.sigaac.dto.ItemCompraDTO;
import com.sigaac.model.Compra;
import com.sigaac.model.Estoque;
import com.sigaac.model.ItemCompra;
import com.sigaac.repository.CompraRepository;
import com.sigaac.repository.EstoqueRepository;
import com.sigaac.repository.ItemCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompraService {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private ItemCompraRepository itemCompraRepository;

    public List<CompraDTO> listarTodas() {
        return compraRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<CompraDTO> buscarPorId(Integer id) {
        return compraRepository.findById(id).map(this::toDTO);
    }

    @Transactional
    public CompraDTO salvar(Compra compra) {
        if (compra.getDataCompra() == null) {
            compra.setDataCompra(LocalDateTime.now());
        }

        List<ItemCompra> itens = compra.getItens() != null ? new ArrayList<>(compra.getItens()) : new ArrayList<>();
        compra.setItens(new ArrayList<>());

        Compra compraSalva = compraRepository.saveAndFlush(compra);

        for (ItemCompra item : itens) {
            item.setCompra(compraSalva);
            itemCompraRepository.save(item);
        }

        compraSalva.setItens(itens);
        atualizarEstoque(itens);
        return toDTO(compraSalva);
    }

    private CompraDTO toDTO(Compra compra) {
        List<ItemCompraDTO> itensDTO = compra.getItens() == null ? new ArrayList<>() :
                compra.getItens().stream().map(item -> new ItemCompraDTO(
                        item.getId(),
                        item.getAlimento() != null ? item.getAlimento().getId() : null,
                        item.getAlimento() != null ? item.getAlimento().getNome() : null,
                        item.getQuantidade(),
                        item.getPreco()
                )).collect(Collectors.toList());
        return new CompraDTO(compra.getId(), compra.getDataCompra(), compra.getObservacoes(), itensDTO);
    }

    @Transactional
    public void deletar(Integer id) {
        compraRepository.deleteById(id);
    }

    private void atualizarEstoque(List<ItemCompra> itens) {
        for (ItemCompra item : itens) {
            Estoque estoque = estoqueRepository.findByAlimentoId(item.getAlimento().getId())
                    .orElseGet(() -> {
                        Estoque novo = new Estoque();
                        novo.setAlimento(item.getAlimento());
                        novo.setQuantidadeAtual(java.math.BigDecimal.ZERO);
                        novo.setQuantidadeMinima(java.math.BigDecimal.ZERO);
                        return novo;
                    });
            estoque.setQuantidadeAtual(estoque.getQuantidadeAtual().add(item.getQuantidade()));
            estoque.setDataUltimaAtualizacao(LocalDateTime.now());
            estoqueRepository.save(estoque);
        }
    }
}
