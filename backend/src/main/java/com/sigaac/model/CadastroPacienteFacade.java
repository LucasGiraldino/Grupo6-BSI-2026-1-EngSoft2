package com.sigaac.model;

import com.sigaac.config.DatabaseManager;

import java.time.LocalDate;

/**
 * Fachada de regra de negócio: cadastra paciente + endereço + prontuário
 * em UMA transação. Esconde do controller a orquestração de 3 models.
 *
 * Padrão Facade - o controller (View/Controller MVC) conhece só este método
 * de caso de uso e não sabe quantos models são gravados nem em que ordem.
 */
public class CadastroPacienteFacade {

    private final DatabaseManager db;

    public CadastroPacienteFacade() {
        this.db = DatabaseManager.getInstance();
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
}