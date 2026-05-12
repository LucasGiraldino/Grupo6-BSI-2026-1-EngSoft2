package com.sigaac.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class TriagemService {

    private final TriagemRepository repository;
    private final ConsultaService consultaService;
    private final ProntuarioRepository prontuarioRepository;

    public TriagemService(TriagemRepository repository, ConsultaService consultaService,
                          ProntuarioRepository prontuarioRepository) {
        this.repository = repository;
        this.consultaService = consultaService;
        this.prontuarioRepository = prontuarioRepository;
    }

    public List<Triagem> listar() {
        return repository.findAll();
    }

    public Optional<Triagem> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    public Triagem criar(Triagem triagem) {
        if (triagem.getDataTriagem() == null) {
            triagem.setDataTriagem(LocalDateTime.now());
        }
        Triagem salva = repository.save(triagem);

        var prontuarioOpt = prontuarioRepository.findById(
            triagem.getProntuario() != null ? triagem.getProntuario().getId() : null);
        prontuarioOpt.ifPresent(prontuario -> {
            Consulta consulta = new Consulta();
            consulta.setPaciente(prontuario.getPaciente());
            consulta.setTriagem(salva);
            consulta.setTipoConsulta("Triagem");
            consulta.setStatus("ESPERANDO");
            consulta.setDataAgendamento(LocalDateTime.now());
            consulta.setObservacoes("Aguardando agendamento");
            consultaService.criar(consulta);
        });

        return salva;
    }

    public Triagem atualizar(Integer id, Triagem triagem) {
        var existente = repository.findById(id).orElseThrow();
        if (triagem.getProntuario() != null) existente.setProntuario(triagem.getProntuario());
        if (triagem.getMedico() != null) existente.setMedico(triagem.getMedico());
        if (triagem.getDataTriagem() != null) existente.setDataTriagem(triagem.getDataTriagem());
        if (triagem.getPressaoArterial() != null) existente.setPressaoArterial(triagem.getPressaoArterial());
        if (triagem.getFebre() != null) existente.setFebre(triagem.getFebre());
        if (triagem.getCondicaoClinica() != null) existente.setCondicaoClinica(triagem.getCondicaoClinica());
        if (triagem.getCondicaoNutricional() != null) existente.setCondicaoNutricional(triagem.getCondicaoNutricional());
        if (triagem.getCondicaoSocial() != null) existente.setCondicaoSocial(triagem.getCondicaoSocial());
        if (triagem.getObservacoes() != null) existente.setObservacoes(triagem.getObservacoes());
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

    public boolean prontuarioExiste(Integer prontuarioId) {
        return prontuarioRepository.findById(prontuarioId).isPresent();
    }
}
