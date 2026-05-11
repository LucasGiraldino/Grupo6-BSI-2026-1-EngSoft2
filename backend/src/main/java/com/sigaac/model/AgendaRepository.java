package com.sigaac.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class AgendaRepository extends BaseRepository {
    public AgendaRepository(com.zaxxer.hikari.HikariDataSource ds) { super(ds); }

    public List<Agenda> findDisponiveisByProfissionalAndData(Integer idProfissional, LocalDate data) {
        return queryList(
            "SELECT a.* FROM agenda a " +
            "JOIN profissionais p ON a.id_usuario = p.id_usuario " +
            "WHERE p.id_profissional = ? AND a.data = ? AND a.disponivel = true " +
            "ORDER BY a.hora_inicio",
            this::mapRow, idProfissional, java.sql.Date.valueOf(data));
    }

    public List<Agenda> findDisponiveisByProfissionalAndDataBetween(Integer idProfissional, LocalDate inicio, LocalDate fim) {
        return queryList(
            "SELECT a.* FROM agenda a " +
            "JOIN profissionais p ON a.id_usuario = p.id_usuario " +
            "WHERE p.id_profissional = ? AND a.data BETWEEN ? AND ? AND a.disponivel = true " +
            "ORDER BY a.data, a.hora_inicio",
            this::mapRow, idProfissional, java.sql.Date.valueOf(inicio), java.sql.Date.valueOf(fim));
    }

    private Agenda mapRow(ResultSet rs) throws SQLException {
        Agenda a = new Agenda();
        a.setId(rs.getInt("id_agenda"));
        a.setData(rs.getObject("data", LocalDate.class));
        a.setHoraInicio(rs.getObject("hora_inicio", LocalTime.class));
        a.setHoraFim(rs.getObject("hora_fim", LocalTime.class));
        a.setDisponivel(rs.getBoolean("disponivel"));
        
        User u = new User();
        u.setId(rs.getObject("id_usuario", Integer.class));
        a.setUsuario(u);
        return a;
    }

    public Agenda save(Agenda a) {
        if (a.getId() == null) {
            Number id = executeInsert(
                "INSERT INTO agenda (id_usuario, data, hora_inicio, hora_fim, disponivel) VALUES (?, ?, ?, ?, ?)",
                a.getUsuario() != null ? a.getUsuario().getId() : null,
                a.getData(), a.getHoraInicio(), a.getHoraFim(), a.getDisponivel());
            if (id != null) a.setId(id.intValue());
        } else {
            executeUpdate(
                "UPDATE agenda SET id_usuario = ?, data = ?, hora_inicio = ?, hora_fim = ?, disponivel = ? WHERE id_agenda = ?",
                a.getUsuario() != null ? a.getUsuario().getId() : null,
                a.getData(), a.getHoraInicio(), a.getHoraFim(), a.getDisponivel(), a.getId());
        }
        return a;
    }
}
