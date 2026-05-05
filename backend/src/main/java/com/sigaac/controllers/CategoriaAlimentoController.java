package com.sigaac.controllers;

import com.sigaac.model.CategoriaAlimento;
import com.sigaac.repository.CategoriaAlimentoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alimentos/categorias")
public class CategoriaAlimentoController {

    @Autowired
    CategoriaAlimentoRepository categoriaAlimentoRepository;

    @GetMapping
    public ResponseEntity<List<CategoriaAlimento>> listar() {
        return ResponseEntity.ok(categoriaAlimentoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaAlimento> buscarPorId(@PathVariable Integer id) {
        return categoriaAlimentoRepository.findById(id)
                .map(categoria -> ResponseEntity.ok(categoria))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaAlimento> criar(@RequestBody CategoriaAlimento body) {
        CategoriaAlimento categoria = categoriaAlimentoRepository.save(body);
        return ResponseEntity.status(201).body(categoria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaAlimento> atualizar(@PathVariable Integer id, @RequestBody CategoriaAlimento categoria) {
        if (!categoriaAlimentoRepository.existsById(id)) return ResponseEntity.notFound().build();

        categoria.setId(id);
        return ResponseEntity.ok(categoriaAlimentoRepository.save(categoria));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (!categoriaAlimentoRepository.existsById(id)) return ResponseEntity.notFound().build();

        categoriaAlimentoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
