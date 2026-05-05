package com.sigaac.controllers;

import com.sigaac.model.Alimento;
import com.sigaac.repository.AlimentoRepository;
import com.sigaac.service.AlimentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alimentos")
public class AlimentoController {

    @Autowired
    AlimentoRepository alimentoRepository;

    @Autowired
    AlimentoService alimentoService;

    @GetMapping
    public ResponseEntity<List<Alimento>> listar() {
        return ResponseEntity.ok(alimentoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alimento> buscarPorId(@PathVariable Integer id) {
        return alimentoRepository.findById(id)
                .map(alimento -> ResponseEntity.ok(alimento))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Alimento> criar(@RequestBody Alimento body) {
        Alimento alimento = alimentoService.criar(body);
        return ResponseEntity.status(201).body(alimento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alimento> atualizar(@PathVariable Integer id, @RequestBody Alimento alimento) {
        if (!alimentoRepository.existsById(id)) return ResponseEntity.notFound().build();

        alimento.setId(id);
        return ResponseEntity.ok(alimentoRepository.save(alimento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (!alimentoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        alimentoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
