package com.sigaac.service;

import com.sigaac.model.Endereco;
import com.sigaac.model.Paciente;
import com.sigaac.repository.EnderecoRepository;
import com.sigaac.repository.PacienteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private EnderecoRepository enderecoRepository;

    public List<Paciente> listar() {
        return pacienteRepository.findAll();
    }

    public Optional<Paciente> buscarPorId(Integer id) {
        return pacienteRepository.findById(id);
    }

    @Transactional
    public Paciente criar(Paciente paciente) {
        if (paciente.getEndereco() != null) {
            Endereco endereco = enderecoRepository.save(paciente.getEndereco());
            paciente.setEndereco(endereco);
        }
        if (paciente.getDataCadastro() == null) {
            paciente.setDataCadastro(LocalDate.now());
        }
        return pacienteRepository.save(paciente);
    }

    @Transactional
    public Paciente atualizar(Integer id, Paciente pacienteAtualizado) {
        Paciente existente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        existente.setNome(pacienteAtualizado.getNome());
        existente.setCpf(pacienteAtualizado.getCpf());
        existente.setDataNascimento(pacienteAtualizado.getDataNascimento());
        existente.setSexo(pacienteAtualizado.getSexo());
        existente.setTelefone(pacienteAtualizado.getTelefone());
        existente.setEmail(pacienteAtualizado.getEmail());
        existente.setRestricoesAlimentares(pacienteAtualizado.getRestricoesAlimentares());

        if (pacienteAtualizado.getEndereco() != null) {
            Endereco endereco = existente.getEndereco();
            if (endereco == null) {
                endereco = new Endereco();
            }
            Endereco endNovo = pacienteAtualizado.getEndereco();
            endereco.setCep(endNovo.getCep());
            endereco.setLogradouro(endNovo.getLogradouro());
            endereco.setNumero(endNovo.getNumero());
            endereco.setComplemento(endNovo.getComplemento());
            endereco.setBairro(endNovo.getBairro());
            endereco.setCidade(endNovo.getCidade());
            endereco.setEstado(endNovo.getEstado());
            endereco.setPais(endNovo.getPais());
            endereco.setDescricao(endNovo.getDescricao());
            enderecoRepository.save(endereco);
            existente.setEndereco(endereco);
        }

        return pacienteRepository.save(existente);
    }

    @Transactional
    public void deletar(Integer id) {
        pacienteRepository.deleteById(id);
    }
}
