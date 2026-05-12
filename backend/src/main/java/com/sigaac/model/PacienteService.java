package com.sigaac.model;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.util.Optional;

public class PacienteService {

    private final PacienteRepository pacienteRepo;
    private final EnderecoRepository enderecoRepo;
    private final ProntuarioRepository prontuarioRepo;

    public PacienteService(PacienteRepository pacienteRepo, EnderecoRepository enderecoRepo,
                           ProntuarioRepository prontuarioRepo) {
        this.pacienteRepo = pacienteRepo;
        this.enderecoRepo = enderecoRepo;
        this.prontuarioRepo = prontuarioRepo;
    }

    public List<Paciente> listar() {
        return pacienteRepo.findAll();
    }

    public Optional<Paciente> buscarPorId(Integer id) {
        return pacienteRepo.findById(id);
    }

    public Paciente criar(Paciente paciente) {
        if (paciente.getCpf() != null && !CpfService.validarMatematicamente(paciente.getCpf())) {
            throw new IllegalArgumentException("CPF inválido. Verifique os dígitos.");
        }
        if (paciente.getDataCadastro() == null) {
            paciente.setDataCadastro(LocalDate.now());
        }
        if (paciente.getEndereco() != null && paciente.getEndereco().getId() == null) {
            paciente.setEndereco(enderecoRepo.save(paciente.getEndereco()));
        }
        Paciente salvo = pacienteRepo.save(paciente);

        Prontuario prontuario = new Prontuario();
        prontuario.setPaciente(salvo);
        prontuario.setDataAbertura(LocalDate.now());
        prontuarioRepo.save(prontuario);

        return salvo;
    }

    public Paciente atualizar(Integer id, Paciente paciente) {
        paciente.setId(id);
        if (paciente.getEndereco() != null && paciente.getEndereco().getId() == null) {
            paciente.setEndereco(enderecoRepo.save(paciente.getEndereco()));
        }
        return pacienteRepo.save(paciente);
    }

    public void deletar(Integer id) {
        pacienteRepo.deleteById(id);
    }
}
