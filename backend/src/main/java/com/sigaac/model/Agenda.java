package com.sigaac.model;

import java.time.LocalDate;
import java.time.LocalTime;

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
