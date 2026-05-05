package com.sigaac.controller;

import com.sigaac.model.Compra;
import com.sigaac.service.CompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
@RequiredArgsConstructor
public class CompraController {

    private final CompraService compraService;

    @GetMapping
    public List<Compra> listar() {
        return compraService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compra> buscar(@PathVariable Integer id) {
        return compraService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Compra criar(@RequestBody Compra compra) {
        return compraService.salvar(compra);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Compra> atualizar(@PathVariable Integer id, @RequestBody Compra compra) {
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
