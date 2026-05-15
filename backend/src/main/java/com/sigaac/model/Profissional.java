package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Profissional {

    private Integer id;
    private User usuario;
    private Endereco endereco;
    private String especialidade;
    private String registroProfissional;
    private LocalDate dataAdmissao;
    private LocalDate dataDemissao;
    private Boolean ehMedico = false;

    public Profissional() {}

    public Profissional(Integer id, User usuario, Endereco endereco, String especialidade,
                        String registroProfissional, LocalDate dataAdmissao, LocalDate dataDemissao) {
        this.id = id;
        this.usuario = usuario;
        this.endereco = endereco;
        this.especialidade = especialidade;
        this.registroProfissional = registroProfissional;
        this.dataAdmissao = dataAdmissao;
        this.dataDemissao = dataDemissao;
    }

    // -- Persistence --

    public static List<Profissional> findAll() { return findAll(null, null); }

    public static List<Profissional> findAll(String nome, String especialidade) {
        var db = DatabaseHelper.getInstance();
        String sql = "SELECT p.*, u.nome AS usuario_nome FROM profissionais p " +
            "JOIN users u ON p.id_usuario = u.id_usuario WHERE 1=1";
        List<Object> params = new ArrayList<>();
        if (nome != null && !nome.isBlank()) {
            sql += " AND u.nome ILIKE ?";
            params.add("%" + nome.trim() + "%");
        }
        if (especialidade != null && !especialidade.isBlank()) {
            sql += " AND p.especialidade ILIKE ?";
            params.add("%" + especialidade.trim() + "%");
        }
        sql += " ORDER BY u.nome";
        return db.queryList(sql, Profissional::mapRow, params.toArray());
    }

    public static Optional<Profissional> findById(Integer id) {
        return DatabaseHelper.getInstance().querySingle(
            "SELECT p.*, u.nome AS usuario_nome FROM profissionais p " +
            "JOIN users u ON p.id_usuario = u.id_usuario " +
            "WHERE p.id_profissional = ?",
            Profissional::mapRow, id);
    }

    public Profissional save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO profissionais (id_usuario, id_endereco, especialidade, registro_profissional, data_admissao) VALUES (?, ?, ?, ?, ?)",
                this.usuario != null ? this.usuario.getId() : null,
                this.endereco != null ? this.endereco.getId() : null,
                this.especialidade, this.registroProfissional, this.dataAdmissao);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE profissionais SET id_usuario = ?, id_endereco = ?, especialidade = ?, registro_profissional = ?, data_admissao = ? WHERE id_profissional = ?",
                this.usuario != null ? this.usuario.getId() : null,
                this.endereco != null ? this.endereco.getId() : null,
                this.especialidade, this.registroProfissional, this.dataAdmissao,
                this.id);
        }
        return this;
    }

    public void delete() {
        DatabaseHelper.getInstance().executeUpdate(
            "UPDATE profissionais SET data_demissao = NOW() WHERE id_profissional = ?", this.id);
    }

    public User loadUser() {
        if (this.usuario != null && this.usuario.getId() != null) {
            this.usuario = User.findById(this.usuario.getId()).orElse(null);
        }
        return this.usuario;
    }

    private static Profissional mapRow(ResultSet rs) throws SQLException {
        Profissional p = new Profissional();
        p.setId(rs.getInt("id_profissional"));
        p.setEspecialidade(rs.getString("especialidade"));
        p.setRegistroProfissional(rs.getString("registro_profissional"));
        p.setDataAdmissao(rs.getObject("data_admissao", LocalDate.class));
        p.setDataDemissao(rs.getObject("data_demissao", LocalDate.class));

        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        try {
            u.setNome(rs.getString("usuario_nome"));
        } catch (SQLException e) {
        }
        p.setUsuario(u);
        return p;
    }

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    public String getRegistroProfissional() { return registroProfissional; }
    public void setRegistroProfissional(String registroProfissional) { this.registroProfissional = registroProfissional; }
    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }
    public LocalDate getDataDemissao() { return dataDemissao; }
    public void setDataDemissao(LocalDate dataDemissao) { this.dataDemissao = dataDemissao; }
    public Boolean getEhMedico() { return ehMedico; }
    public void setEhMedico(Boolean ehMedico) { this.ehMedico = ehMedico; }
}
