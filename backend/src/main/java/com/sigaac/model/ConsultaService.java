package com.sigaac.model;

import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.List;

public class ConsultaService {

    private final ConsultaRepository repository;
    private final HikariDataSource ds;

    public ConsultaService(ConsultaRepository repository, HikariDataSource ds) {
        this.repository = repository;
        this.ds = ds;
    }

    public List<Consulta> listar() {
        return repository.findAll();
    }

    public Consulta criar(Consulta consulta) {
        return repository.save(consulta);
    }

    public Consulta buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void cancelar(Integer id) {
        try (Connection conn = ds.getConnection()) {
            conn.setAutoCommit(false);
            try {
                var consulta = repository.findById(id);
                if (consulta.isEmpty()) {
                    throw new IllegalArgumentException("Consulta não encontrada.");
                }
                if (!"AGENDADA".equals(consulta.get().getStatus())) {
                    throw new IllegalStateException("A consulta não está no status AGENDADA e não pode ser cancelada.");
                }

                repository.cancelar(conn, id, LocalDateTime.now());

                var idAgenda = repository.findIdAgendaById(conn, id);
                idAgenda.ifPresent(agId -> {
                    try (var stmt = conn.prepareStatement("UPDATE agenda SET disponivel = TRUE WHERE id_agenda = ?")) {
                        stmt.setInt(1, agId);
                        stmt.executeUpdate();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });

                conn.commit();
            } catch (Exception e) {
                conn.rollback();
                throw e;
            }
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao cancelar consulta.", e);
        }
    }
}
