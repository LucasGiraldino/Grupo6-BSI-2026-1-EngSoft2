package com.sigaac.service;

import com.sigaac.model.Compra;
import com.sigaac.model.Estoque;
import com.sigaac.model.ItemCompra;
import com.sigaac.repository.CompraRepository;
import com.sigaac.repository.EstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;
    private final EstoqueRepository estoqueRepository;

    public List<Compra> listarTodas() {
        return compraRepository.findAll();
    }

    public Optional<Compra> buscarPorId(Integer id) {
        return compraRepository.findById(id);
    }

    @Transactional
    public Compra salvar(Compra compra) {
        if (compra.getDataCompra() == null) {
            compra.setDataCompra(LocalDateTime.now());
        }
        Compra compraSalva = compraRepository.save(compra);
        atualizarEstoque(compraSalva.getItens());
        return compraSalva;
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
