package com.sigaac.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class PacienteService {

    private final PacienteRepository pacienteRepo;
    private final EnderecoRepository enderecoRepo;

    public PacienteService(PacienteRepository pacienteRepo, EnderecoRepository enderecoRepo) {
        this.pacienteRepo = pacienteRepo;
        this.enderecoRepo = enderecoRepo;
    }

    public List<Paciente> listar() {
        return pacienteRepo.findAll();
    }

    public Optional<Paciente> buscarPorId(Integer id) {
        return pacienteRepo.findById(id);
    }

    public Paciente criar(Paciente paciente) {
        if (paciente.getDataCadastro() == null) {
            paciente.setDataCadastro(LocalDate.now());
        }
        if (paciente.getEndereco() != null && paciente.getEndereco().getId() == null) {
            paciente.setEndereco(enderecoRepo.save(paciente.getEndereco()));
        }
        return pacienteRepo.save(paciente);
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
