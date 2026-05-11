package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class ExameRepository extends BaseRepository {

    private final TipoExameRepository tipoExameRepo;

    public ExameRepository(com.zaxxer.hikari.HikariDataSource ds) {
        super(ds);
        this.tipoExameRepo = new TipoExameRepository(ds);
    }

    private static final String BASE_SELECT =
        "SELECT e.*, " +
        "       te.id_tipo_exame, te.nome AS te_nome, te.descricao AS te_descricao, te.ativo AS te_ativo, " +
        "       m.id_medico, m.crm, m.especialidade_medica, " +
        "       u.id_usuario, u.nome AS medico_nome, " +
        "       p.id_prontuario, p.data_abertura AS p_data_abertura, p.data_fechamento AS p_data_fechamento, " +
        "       pac.id_paciente, pac.nome AS paciente_nome " +
        "FROM exames e " +
        "LEFT JOIN tipos_exame te ON e.id_tipo_exame = te.id_tipo_exame " +
        "LEFT JOIN medicos m ON e.id_medico = m.id_medico " +
        "LEFT JOIN users u ON m.id_usuario = u.id_usuario " +
        "LEFT JOIN prontuarios p ON e.id_prontuario = p.id_prontuario " +
        "LEFT JOIN pacientes pac ON p.id_paciente = pac.id_paciente ";

    public List<Exame> findAll() {
        return queryList(BASE_SELECT + "WHERE e.deleted_at IS NULL ORDER BY e.id_exame", this::mapRow);
    }

    public Optional<Exame> findById(Integer id) {
        return querySingle(BASE_SELECT + "WHERE e.id_exame = ? AND e.deleted_at IS NULL", this::mapRow, id);
    }

    public Exame save(Exame exame) {
        if (exame.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO exames (id_prontuario, id_medico, id_tipo_exame, justificativa_clinica, data_solicitacao, status, observacoes_medico, data_realizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                exame.getProntuario() != null ? exame.getProntuario().getId() : null,
                exame.getMedico() != null ? exame.getMedico().getId() : null,
                exame.getTipoExame() != null ? exame.getTipoExame().getId() : null,
                exame.getJustificativaClinica(),
                exame.getDataSolicitacao(),
                exame.getStatus(),
                exame.getObservacoesMedico(),
                exame.getDataRealizacao());
            if (id != null) exame.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE exames SET id_prontuario = ?, id_medico = ?, id_tipo_exame = ?, justificativa_clinica = ?, data_solicitacao = ?, status = ?, observacoes_medico = ?, data_realizacao = ? WHERE id_exame = ?",
                exame.getProntuario() != null ? exame.getProntuario().getId() : null,
                exame.getMedico() != null ? exame.getMedico().getId() : null,
                exame.getTipoExame() != null ? exame.getTipoExame().getId() : null,
                exame.getJustificativaClinica(),
                exame.getDataSolicitacao(),
                exame.getStatus(),
                exame.getObservacoesMedico(),
                exame.getDataRealizacao(),
                exame.getId());
        }
        return exame;
    }

    public void deleteById(Integer id) {
        executeUpdate("UPDATE exames SET deleted_at = NOW() WHERE id_exame = ?", id);
    }

    public List<Medico> findAllMedicos() {
        return queryList(
            "SELECT m.*, u.nome AS usuario_nome FROM medicos m " +
            "JOIN users u ON m.id_usuario = u.id_usuario " +
            "WHERE m.deleted_at IS NULL " +
            "ORDER BY u.nome",
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

    private Exame mapRow(ResultSet rs) throws SQLException {
        Exame e = new Exame();
        e.setId(rs.getInt("id_exame"));
        e.setJustificativaClinica(rs.getString("justificativa_clinica"));
        e.setDataSolicitacao(rs.getObject("data_solicitacao", LocalDateTime.class));
        e.setStatus(rs.getString("status"));
        e.setObservacoesMedico(rs.getString("observacoes_medico"));
        e.setDataRealizacao(rs.getObject("data_realizacao", LocalDate.class));
        e.setDeletedAt(rs.getObject("deleted_at", LocalDateTime.class));

        TipoExame te = new TipoExame();
        te.setId(rs.getInt("id_tipo_exame"));
        te.setNome(rs.getString("te_nome"));
        te.setDescricao(rs.getString("te_descricao"));
        te.setAtivo(rs.getObject("te_ativo", Boolean.class));
        e.setTipoExame(te);

        Medico m = new Medico();
        m.setId(rs.getInt("id_medico"));
        m.setCrm(rs.getString("crm"));
        m.setEspecialidadeMedica(rs.getString("especialidade_medica"));
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        u.setNome(rs.getString("medico_nome"));
        m.setUsuario(u);
        e.setMedico(m);

        Prontuario p = new Prontuario();
        p.setId(rs.getInt("id_prontuario"));
        p.setDataAbertura(rs.getObject("p_data_abertura", LocalDate.class));
        p.setDataFechamento(rs.getObject("p_data_fechamento", LocalDate.class));
        Paciente pac = new Paciente();
        pac.setId(rs.getObject("id_paciente", Integer.class));
        pac.setNome(rs.getString("paciente_nome"));
        p.setPaciente(pac);
        e.setProntuario(p);

        return e;
    }
}
