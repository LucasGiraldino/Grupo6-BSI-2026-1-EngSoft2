package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class ConsultaService {

    private final ConsultaRepository repository;

    public ConsultaService(ConsultaRepository repository) {
        this.repository = repository;
    }

    public List<Consulta> listar() {
        return repository.findAll();
    }

    public Optional<Consulta> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Consulta criar(Consulta consulta) {
        if (consulta.getDataAgendamento() == null) {
            consulta.setDataAgendamento(LocalDateTime.now());
        }
        return repository.save(consulta);
    }

    public Consulta atualizar(Integer id, Consulta consulta) {
        var existente = repository.findById(id).orElseThrow();
        if (consulta.getPaciente() != null) existente.setPaciente(consulta.getPaciente());
        if (consulta.getProfissional() != null) existente.setProfissional(consulta.getProfissional());
        if (consulta.getAgenda() != null) existente.setAgenda(consulta.getAgenda());
        if (consulta.getTipoConsulta() != null) existente.setTipoConsulta(consulta.getTipoConsulta());
        if (consulta.getStatus() != null) existente.setStatus(consulta.getStatus());
        if (consulta.getObservacoes() != null) existente.setObservacoes(consulta.getObservacoes());
        if (consulta.getDataAgendamento() != null) existente.setDataAgendamento(consulta.getDataAgendamento());
        if (consulta.getDataCancelamento() != null) existente.setDataCancelamento(consulta.getDataCancelamento());
        return repository.save(existente);
    }

    public List<Consulta> listarPorStatus(String status) {
        return repository.findByStatus(status);
    }

    public List<Consulta> listarPorProfissionalEIntervalo(Integer profissionalId, LocalDate inicio, LocalDate fim) {
        return repository.findByProfissionalAndDataBetween(profissionalId, inicio, fim);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }
}
