package com.sigaac.controller;

import com.sigaac.config.DatabaseManager;
import com.sigaac.model.Endereco;
import com.sigaac.model.Paciente;
import com.sigaac.model.Prontuario;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Fachada da camada de controle para o cadastro de pacientes: é o único ponto
 * de acesso do PacienteController aos models Paciente, Endereco e Prontuario.
 * O cadastro grava paciente + endereço + prontuário em UMA transação.
 *
 * Padrão Facade - o controller conhece só os métodos de caso de uso
 * (listar, buscar, cadastrar, atualizar, excluir) e não sabe quantos models
 * são gravados nem em que ordem.
 * Padrão Singleton - uma única instância da fachada, obtida por getInstance().
 */
public class CadastroPacienteFacade {

    private final DatabaseManager db;

    private CadastroPacienteFacade() {
        this.db = DatabaseManager.getInstance();
    }

    private static class Holder {
        static final CadastroPacienteFacade INSTANCE = new CadastroPacienteFacade();
    }

    public static CadastroPacienteFacade getInstance() {
        return Holder.INSTANCE;
    }

    public List<Paciente> listar(String nome, String cpf) {
        return Paciente.findAll(nome, cpf);
    }

    public Optional<Paciente> buscarPorId(Integer id) {
        return Paciente.findById(id);
    }

    public Paciente cadastrar(Paciente paciente) {
        paciente.validar();
        if (paciente.getDataCadastro() == null) {
            paciente.setDataCadastro(LocalDate.now());
        }
        db.executeInTransaction(conn -> {
            Endereco endereco = paciente.getEndereco();
            if (endereco != null && endereco.getId() == null) {
                paciente.setEndereco(endereco.save(conn));
            }
            paciente.save(conn);
            new Prontuario(paciente).save(conn);
        });
        return paciente;
    }

    public Paciente atualizar(Paciente paciente) {
        db.executeInTransaction(conn -> {
            Endereco endereco = paciente.getEndereco();
            if (endereco != null && endereco.getId() == null) {
                paciente.setEndereco(endereco.save(conn));
            }
            paciente.save(conn);
        });
        return paciente;
    }

    public void excluir(Paciente paciente) {
        paciente.delete();
    }
}
