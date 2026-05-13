package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PacienteRepository extends BaseRepository {

    private final EnderecoRepository enderecoRepo;

    public PacienteRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
        this.enderecoRepo = new EnderecoRepository(ds);
    }

    public List<Paciente> findAll() {
        return findAll(null, null);
    }

    public List<Paciente> findAll(String nome, String cpf) {
        String sql = "SELECT * FROM pacientes WHERE deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (nome != null && !nome.isBlank()) {
            sql += " AND nome ILIKE ?";
            params.add("%" + nome.trim() + "%");
        }
        if (cpf != null && !cpf.isBlank()) {
            sql += " AND cpf ILIKE ?";
            params.add("%" + cpf.trim() + "%");
        }
        sql += " ORDER BY nome";
        return queryList(sql, this::mapRow, params.toArray());
    }

    public Optional<Paciente> findById(Integer id) {
        return querySingle(
            "SELECT * FROM pacientes WHERE id_paciente = ? AND deleted_at IS NULL",
            this::mapRow, id);
    }

    public Optional<Paciente> findByCpf(String cpf) {
        return querySingle(
            "SELECT * FROM pacientes WHERE cpf = ? AND deleted_at IS NULL",
            this::mapRow, cpf);
    }

    public Paciente save(Paciente paciente) {
        if (paciente.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO pacientes (id_endereco, nome, cpf, data_nascimento, sexo, telefone, email, restricoes_alimentares, data_cadastro, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                paciente.getEndereco() != null ? paciente.getEndereco().getId() : null,
                paciente.getNome(), paciente.getCpf(), paciente.getDataNascimento(),
                paciente.getSexo(), paciente.getTelefone(), paciente.getEmail(),
                paciente.getRestricoesAlimentares(), paciente.getDataCadastro(), true);
            if (id != null) paciente.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE pacientes SET id_endereco = ?, nome = ?, cpf = ?, data_nascimento = ?, sexo = ?, telefone = ?, email = ?, restricoes_alimentares = ?, ativo = ? WHERE id_paciente = ?",
                paciente.getEndereco() != null ? paciente.getEndereco().getId() : null,
                paciente.getNome(), paciente.getCpf(), paciente.getDataNascimento(),
                paciente.getSexo(), paciente.getTelefone(), paciente.getEmail(),
                paciente.getRestricoesAlimentares(), true, paciente.getId());
        }
        return paciente;
    }

    public void deleteById(Integer id) {
        executeUpdate("UPDATE pacientes SET deleted_at = NOW() WHERE id_paciente = ?", id);
    }

    private Paciente mapRow(ResultSet rs) throws SQLException {
        Paciente p = new Paciente();
        p.setId(rs.getInt("id_paciente"));
        p.setNome(rs.getString("nome"));
        p.setCpf(rs.getString("cpf"));
        p.setDataNascimento(rs.getObject("data_nascimento", java.time.LocalDate.class));
        p.setSexo(rs.getString("sexo"));
        p.setTelefone(rs.getString("telefone"));
        p.setEmail(rs.getString("email"));
        p.setRestricoesAlimentares(rs.getString("restricoes_alimentares"));
        p.setDataCadastro(rs.getObject("data_cadastro", java.time.LocalDate.class));
        p.setDeletedAt(rs.getObject("deleted_at", java.time.LocalDateTime.class));
        Integer idEndereco = rs.getObject("id_endereco", Integer.class);
        if (idEndereco != null) {
            p.setEndereco(enderecoRepo.findById(idEndereco).orElse(null));
        }
        return p;
    }
}
