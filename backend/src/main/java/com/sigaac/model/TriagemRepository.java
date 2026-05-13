package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TriagemRepository extends BaseRepository {

    public TriagemRepository(com.zaxxer.hikari.HikariDataSource ds) { super(ds); }

    private static final String BASE_SELECT =
        "SELECT t.*, " +
        "       m.id_medico, m.crm, m.especialidade_medica, " +
        "       u.id_usuario, u.nome AS medico_nome, " +
        "       p.id_prontuario, p.data_abertura AS p_data_abertura, " +
        "       pac.id_paciente, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf " +
        "FROM triagens t " +
        "LEFT JOIN medicos m ON t.id_medico = m.id_medico " +
        "LEFT JOIN users u ON m.id_usuario = u.id_usuario " +
        "LEFT JOIN prontuarios p ON t.id_prontuario = p.id_prontuario " +
        "LEFT JOIN pacientes pac ON p.id_paciente = pac.id_paciente ";

    public List<Triagem> findAll() {
        return findAll(null, null);
    }

    public List<Triagem> findAll(String nomePaciente, Integer medicoId) {
        String sql = BASE_SELECT + "WHERE t.deleted_at IS NULL";
        List<Object> params = new ArrayList<>();
        if (nomePaciente != null && !nomePaciente.isBlank()) {
            sql += " AND pac.nome ILIKE ?";
            params.add("%" + nomePaciente.trim() + "%");
        }
        if (medicoId != null) {
            sql += " AND t.id_medico = ?";
            params.add(medicoId);
        }
        sql += " ORDER BY t.data_triagem DESC";
        return queryList(sql, this::mapRow, params.toArray());
    }

    public Optional<Triagem> findById(Integer id) {
        return querySingle(BASE_SELECT + "WHERE t.id_triagem = ? AND t.deleted_at IS NULL", this::mapRow, id);
    }

    public Triagem save(Triagem triagem) {
        if (triagem.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO triagens (id_prontuario, id_medico, data_triagem, pressao_arterial, febre, condicao_clinica, condicao_nutricional, condicao_social, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                triagem.getProntuario() != null ? triagem.getProntuario().getId() : null,
                triagem.getMedico() != null ? triagem.getMedico().getId() : null,
                triagem.getDataTriagem(),
                triagem.getPressaoArterial(),
                triagem.getFebre(),
                triagem.getCondicaoClinica(),
                triagem.getCondicaoNutricional(),
                triagem.getCondicaoSocial(),
                triagem.getObservacoes());
            if (id != null) triagem.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE triagens SET id_prontuario = ?, id_medico = ?, data_triagem = ?, pressao_arterial = ?, febre = ?, condicao_clinica = ?, condicao_nutricional = ?, condicao_social = ?, observacoes = ? WHERE id_triagem = ?",
                triagem.getProntuario() != null ? triagem.getProntuario().getId() : null,
                triagem.getMedico() != null ? triagem.getMedico().getId() : null,
                triagem.getDataTriagem(),
                triagem.getPressaoArterial(),
                triagem.getFebre(),
                triagem.getCondicaoClinica(),
                triagem.getCondicaoNutricional(),
                triagem.getCondicaoSocial(),
                triagem.getObservacoes(),
                triagem.getId());
        }
        return triagem;
    }

    public void deleteById(Integer id) {
        executeUpdate("UPDATE triagens SET deleted_at = NOW() WHERE id_triagem = ?", id);
    }

    public List<Medico> findAllMedicos() {
        return queryList(
            "SELECT m.*, u.nome AS usuario_nome FROM medicos m " +
            "JOIN users u ON m.id_usuario = u.id_usuario " +
            "WHERE m.deleted_at IS NULL ORDER BY u.nome",
            rs -> {
                Medico m = new Medico();
                m.setId(rs.getInt("id_medico"));
                m.setCrm(rs.getString("crm"));
                m.setEspecialidadeMedica(rs.getString("especialidade_medica"));
                User u = new User();
                u.setNome(rs.getString("usuario_nome"));
                m.setUsuario(u);
                return m;
            });
    }

    public List<Prontuario> findAllProntuarios() {
        return searchProntuarios(null);
    }

    public List<Prontuario> searchProntuarios(String query) {
        String sql = "SELECT p.*, pac.id_paciente, pac.nome AS paciente_nome, pac.cpf AS paciente_cpf FROM prontuarios p " +
            "JOIN pacientes pac ON p.id_paciente = pac.id_paciente " +
            "WHERE p.data_fechamento IS NULL";
        if (query != null && !query.isBlank()) {
            sql += " AND (pac.nome ILIKE ? OR pac.cpf ILIKE ? OR CAST(p.id_prontuario AS TEXT) ILIKE ?)";
            String pattern = "%" + query.trim() + "%";
            return queryList(sql + " ORDER BY pac.nome LIMIT 10",
                this::mapProntuarioRow, pattern, pattern, pattern);
        }
        return queryList(sql + " ORDER BY pac.nome LIMIT 20", this::mapProntuarioRow);
    }

    private Prontuario mapProntuarioRow(ResultSet rs) throws SQLException {
        Prontuario p = new Prontuario();
        p.setId(rs.getInt("id_prontuario"));
        p.setDataAbertura(rs.getObject("data_abertura", LocalDate.class));
        Paciente pac = new Paciente();
        pac.setId(rs.getInt("id_paciente"));
        pac.setNome(rs.getString("paciente_nome"));
        pac.setCpf(rs.getString("paciente_cpf"));
        p.setPaciente(pac);
        return p;
    }

    private Triagem mapRow(ResultSet rs) throws SQLException {
        Triagem t = new Triagem();
        t.setId(rs.getInt("id_triagem"));
        t.setDataTriagem(rs.getObject("data_triagem", LocalDateTime.class));
        t.setPressaoArterial(rs.getString("pressao_arterial"));
        t.setFebre(rs.getBigDecimal("febre"));
        t.setCondicaoClinica(rs.getString("condicao_clinica"));
        t.setCondicaoNutricional(rs.getString("condicao_nutricional"));
        t.setCondicaoSocial(rs.getString("condicao_social"));
        t.setObservacoes(rs.getString("observacoes"));
        t.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));

        Medico m = new Medico();
        m.setId(rs.getInt("id_medico"));
        m.setCrm(rs.getString("crm"));
        m.setEspecialidadeMedica(rs.getString("especialidade_medica"));
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        u.setNome(rs.getString("medico_nome"));
        m.setUsuario(u);
        t.setMedico(m);

        Prontuario p = new Prontuario();
        p.setId(rs.getInt("id_prontuario"));
        p.setDataAbertura(rs.getObject("p_data_abertura", LocalDate.class));
        Paciente pac = new Paciente();
        pac.setId(rs.getObject("id_paciente", Integer.class));
        pac.setNome(rs.getString("paciente_nome"));
        pac.setCpf(rs.getString("paciente_cpf"));
        p.setPaciente(pac);
        t.setProntuario(p);

        return t;
    }
}
