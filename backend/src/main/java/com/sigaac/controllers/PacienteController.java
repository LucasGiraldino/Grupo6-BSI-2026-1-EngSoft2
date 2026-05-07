package com.sigaac.controllers;

import com.sigaac.model.Paciente;
import com.sigaac.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @GetMapping
    public ResponseEntity<List<Paciente>> listar() {
        return ResponseEntity.ok(pacienteService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Integer id) {
        return pacienteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Paciente> criar(@RequestBody Paciente paciente) {
        Paciente salvo = pacienteService.criar(paciente);
        return ResponseEntity.status(201).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Integer id, @RequestBody Paciente paciente) {
        if (pacienteService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Paciente atualizado = pacienteService.atualizar(id, paciente);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (pacienteService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        pacienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
