package com.sigaac.model;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DoacaoService {

    private static final Logger logger = LoggerFactory.getLogger(DoacaoService.class);

    private final DoacaoRepository doacaoRepo;
    private final PacienteRepository pacienteRepo;
    private final ProfissionalRepository profissionalRepo;
    private final EstoqueRepository estoqueRepo;
    private final AlimentoRepository alimentoRepo;
    private final HikariDataSource ds;

    public DoacaoService(DoacaoRepository doacaoRepo, PacienteRepository pacienteRepo,
                         ProfissionalRepository profissionalRepo, EstoqueRepository estoqueRepo,
                         AlimentoRepository alimentoRepo, HikariDataSource ds) {
        this.doacaoRepo = doacaoRepo;
        this.pacienteRepo = pacienteRepo;
        this.profissionalRepo = profissionalRepo;
        this.estoqueRepo = estoqueRepo;
        this.alimentoRepo = alimentoRepo;
        this.ds = ds;
    }

    public Doacao efetuarDoacao(DoacaoRequestDTO dto) {
        Paciente paciente = pacienteRepo.findById(dto.getIdPaciente())
                .orElseThrow(() -> new IllegalArgumentException("Paciente não cadastrado."));

        Profissional profissional = profissionalRepo.findById(dto.getIdProfissional())
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

        try (Connection conn = ds.getConnection()) {
            conn.setAutoCommit(false);
            try {
                doacaoRepo.save(doacao);

                for (DoacaoRequestDTO.ItemDoacaoRequestDTO itemDto : dto.getItens()) {
                    Alimento alimento = alimentoRepo.findById(itemDto.getIdAlimento())
                            .orElseThrow(() -> new IllegalArgumentException("Alimento não encontrado."));

                    Estoque estoque = estoqueRepo.findByAlimentoId(itemDto.getIdAlimento())
                            .orElseThrow(() -> new IllegalArgumentException("Estoque não localizado para o alimento informado."));

                    if (estoque.getQuantidadeAtual().compareTo(itemDto.getQuantidade()) < 0) {
                        throw new IllegalStateException("Estoque insuficiente para o alimento: " + alimento.getNome());
                    }

                    estoque.setQuantidadeAtual(estoque.getQuantidadeAtual().subtract(itemDto.getQuantidade()));
                    estoque.setDataUltimaAtualizacao(LocalDateTime.now());
                    estoqueRepo.save(estoque);

                    ItemDoacao itemDoacao = new ItemDoacao();
                    itemDoacao.setDoacao(doacao);
                    itemDoacao.setAlimento(alimento);
                    itemDoacao.setQuantidade(itemDto.getQuantidade());
                    itemDoacao.setPeso(null);

                    try (PreparedStatement stmt = conn.prepareStatement(
                            "INSERT INTO itens_doacao (id_doacao, id_alimento, quantidade, peso) VALUES (?, ?, ?, ?)",
                            Statement.RETURN_GENERATED_KEYS)) {
                        stmt.setInt(1, doacao.getId());
                        stmt.setInt(2, alimento.getId());
                        stmt.setBigDecimal(3, itemDto.getQuantidade());
                        stmt.setNull(4, java.sql.Types.DECIMAL);
                        stmt.executeUpdate();
                    }

                    doacao.getItens().add(itemDoacao);
                }

                conn.commit();
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) throw (IllegalArgumentException) e;
            if (e instanceof IllegalStateException) throw (IllegalStateException) e;
            throw new RuntimeException(e);
        }

        return doacao;
    }

    public List<Doacao> listarTodas() {
        return doacaoRepo.findAll();
    }

    public Optional<Doacao> buscarPorId(Integer id) {
        return doacaoRepo.findById(id);
    }

    public void deletar(Integer id) {
        doacaoRepo.deleteById(id);
    }
}
