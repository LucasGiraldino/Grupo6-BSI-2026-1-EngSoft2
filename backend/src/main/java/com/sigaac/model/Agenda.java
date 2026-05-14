package com.sigaac.model;

import com.sigaac.config.DatabaseHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class Agenda {

    private Integer id;
    private User usuario;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private Boolean disponivel = true;

    public Agenda() {}

    public Agenda(Integer id, User usuario, LocalDate data, LocalTime horaInicio,
                  LocalTime horaFim, Boolean disponivel) {
        this.id = id;
        this.usuario = usuario;
        this.data = data;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.disponivel = disponivel;
    }

    // -- Persistence --

    public static List<Agenda> findDisponiveisByProfissionalAndData(Integer idProfissional, LocalDate data) {
        return DatabaseHelper.getInstance().queryList(
            "SELECT a.* FROM agenda a " +
            "JOIN profissionais p ON a.id_usuario = p.id_usuario " +
            "WHERE p.id_profissional = ? AND a.data = ? AND a.disponivel = true " +
            "ORDER BY a.hora_inicio",
            Agenda::mapRow, idProfissional, java.sql.Date.valueOf(data));
    }

    public static List<Agenda> findDisponiveisByProfissionalAndDataBetween(Integer idProfissional, LocalDate inicio, LocalDate fim) {
        return DatabaseHelper.getInstance().queryList(
            "SELECT a.* FROM agenda a " +
            "JOIN profissionais p ON a.id_usuario = p.id_usuario " +
            "WHERE p.id_profissional = ? AND a.data BETWEEN ? AND ? AND a.disponivel = true " +
            "ORDER BY a.data, a.hora_inicio",
            Agenda::mapRow, idProfissional, java.sql.Date.valueOf(inicio), java.sql.Date.valueOf(fim));
    }

    public Agenda save() {
        var db = DatabaseHelper.getInstance();
        if (this.id == null) {
            Number id = db.executeInsert(
                "INSERT INTO agenda (id_usuario, data, hora_inicio, hora_fim, disponivel) VALUES (?, ?, ?, ?, ?)",
                this.usuario != null ? this.usuario.getId() : null,
                this.data, this.horaInicio, this.horaFim, this.disponivel);
            if (id != null) this.id = id.intValue();
        } else {
            db.executeUpdate(
                "UPDATE agenda SET id_usuario = ?, data = ?, hora_inicio = ?, hora_fim = ?, disponivel = ? WHERE id_agenda = ?",
                this.usuario != null ? this.usuario.getId() : null,
                this.data, this.horaInicio, this.horaFim, this.disponivel, this.id);
        }
        return this;
    }

    private static Agenda mapRow(ResultSet rs) throws SQLException {
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

    // -- Getters / Setters --

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }
    public LocalTime getHoraFim() { return horaFim; }
    public void setHoraFim(LocalTime horaFim) { this.horaFim = horaFim; }
    public Boolean getDisponivel() { return disponivel; }
    public void setDisponivel(Boolean disponivel) { this.disponivel = disponivel; }
}
