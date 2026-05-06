package com.sigaac.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "medicos")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE medicos SET deleted_at = NOW() WHERE id_medico = ?")
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medico")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_endereco")
    private Endereco endereco;

    @Column(name = "crm", length = 20, nullable = false, unique = true)
    private String crm;

    @Column(name = "especialidade_medica", length = 100, nullable = false)
    private String especialidadeMedica;

    @Column(name = "data_admissao", nullable = false)
    private LocalDate dataAdmissao;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Medico() {}

    public Medico(Integer id, User usuario, Endereco endereco, String crm,
                  String especialidadeMedica, LocalDate dataAdmissao, LocalDateTime deletedAt) {
        this.id = id;
        this.usuario = usuario;
        this.endereco = endereco;
        this.crm = crm;
        this.especialidadeMedica = especialidadeMedica;
        this.dataAdmissao = dataAdmissao;
        this.deletedAt = deletedAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }

    public String getEspecialidadeMedica() { return especialidadeMedica; }
    public void setEspecialidadeMedica(String especialidadeMedica) { this.especialidadeMedica = especialidadeMedica; }

    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
