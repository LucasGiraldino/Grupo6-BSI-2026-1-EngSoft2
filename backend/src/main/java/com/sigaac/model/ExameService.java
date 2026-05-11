package com.sigaac.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class ExameService {

    private final ExameRepository repository;

    public ExameService(ExameRepository repository) {
        this.repository = repository;
    }

    public List<Exame> listar() {
        return repository.findAll();
    }

    public Optional<Exame> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Exame criar(Exame exame) {
        if (exame.getDataSolicitacao() == null) {
            exame.setDataSolicitacao(LocalDateTime.now());
        }
        return repository.save(exame);
    }

    public Exame atualizar(Integer id, Exame exame) {
        var existente = repository.findById(id).orElseThrow();
        if (exame.getProntuario() != null) existente.setProntuario(exame.getProntuario());
        if (exame.getMedico() != null) existente.setMedico(exame.getMedico());
        if (exame.getTipoExame() != null) existente.setTipoExame(exame.getTipoExame());
        if (exame.getJustificativaClinica() != null) existente.setJustificativaClinica(exame.getJustificativaClinica());
        if (exame.getDataSolicitacao() != null) existente.setDataSolicitacao(exame.getDataSolicitacao());
        if (exame.getStatus() != null) existente.setStatus(exame.getStatus());
        if (exame.getObservacoesMedico() != null) existente.setObservacoesMedico(exame.getObservacoesMedico());
        if (exame.getDataRealizacao() != null) existente.setDataRealizacao(exame.getDataRealizacao());
        return repository.save(existente);
    }

    public void deletar(Integer id) {
        repository.deleteById(id);
    }

    public List<Medico> listarMedicos() {
        return repository.findAllMedicos();
    }

    public List<Prontuario> listarProntuarios() {
        return repository.findAllProntuarios();
    }

    public List<Prontuario> buscarProntuarios(String query) {
        return repository.searchProntuarios(query);
    }
}
