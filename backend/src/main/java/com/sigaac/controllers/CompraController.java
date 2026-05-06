package com.sigaac.controllers;

import com.sigaac.dto.CompraDTO;
import com.sigaac.model.Compra;
import com.sigaac.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @GetMapping
    public List<CompraDTO> listar() {
        return compraService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraDTO> buscar(@PathVariable Integer id) {
        return compraService.buscarPorId(id)
                .map(c -> ResponseEntity.ok(c))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CompraDTO criar(@RequestBody Compra compra) {
        return compraService.salvar(compra);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompraDTO> atualizar(@PathVariable Integer id, @RequestBody Compra compra) {
        return compraService.buscarPorId(id)
                .map(existing -> {
                    compra.setId(id);
                    return ResponseEntity.ok(compraService.salvar(compra));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        return compraService.buscarPorId(id)
                .map(existing -> {
                    compraService.deletar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
