package com.sigaac.model;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class CompraService {

    private final CompraRepository compraRepo;
    private final AlimentoRepository alimentoRepo;
    private final com.zaxxer.hikari.HikariDataSource ds;

    public CompraService(CompraRepository compraRepo, AlimentoRepository alimentoRepo,
                         com.zaxxer.hikari.HikariDataSource ds) {
        this.compraRepo = compraRepo;
        this.alimentoRepo = alimentoRepo;
        this.ds = ds;
    }

    public List<CompraDTO> listarTodas() {
        return compraRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<CompraDTO> buscarPorId(Integer id) {
        return compraRepo.findById(id).map(this::toDTO);
    }

    public CompraDTO salvar(Compra compra) {
        if (compra.getDataCompra() == null) {
            compra.setDataCompra(LocalDateTime.now());
        }

        try (Connection conn = ds.getConnection()) {
            conn.setAutoCommit(false);
            try {
                compraRepo.save(compra);

                if (compra.getItens() != null) {
                    for (ItemCompra item : compra.getItens()) {
                        item.setCompra(compra);
                        try (PreparedStatement stmt = conn.prepareStatement(
                                "INSERT INTO itens_compra (id_compra, id_alimento, quantidade, preco) VALUES (?, ?, ?, ?)",
                                Statement.RETURN_GENERATED_KEYS)) {
                            stmt.setInt(1, compra.getId());
                            stmt.setObject(2, item.getAlimento() != null ? item.getAlimento().getId() : null);
                            stmt.setBigDecimal(3, item.getQuantidade());
                            stmt.setBigDecimal(4, item.getPreco());
                            stmt.executeUpdate();
                        }

                        Estoque estoque = null;
                        try {
                            estoque = new EstoqueRepository(ds).findByAlimentoId(
                                    item.getAlimento().getId()).orElse(null);
                        } catch (Exception e) {}
                    }
                }

                conn.commit();
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return toDTO(compra);
    }

    public void deletar(Integer id) {
        compraRepo.deleteById(id);
    }

    private CompraDTO toDTO(Compra compra) {
        CompraDTO dto = new CompraDTO();
        dto.setId(compra.getId());
        dto.setDataCompra(compra.getDataCompra());
        dto.setObservacoes(compra.getObservacoes());
        if (compra.getItens() != null) {
            dto.setItens(compra.getItens().stream().map(item -> {
                ItemCompraDTO itemDTO = new ItemCompraDTO();
                itemDTO.setId(item.getId());
                itemDTO.setQuantidade(item.getQuantidade());
                itemDTO.setPreco(item.getPreco());
                if (item.getAlimento() != null) {
                    itemDTO.setIdAlimento(item.getAlimento().getId());
                    itemDTO.setNomeAlimento(item.getAlimento().getNome());
                }
                return itemDTO;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
