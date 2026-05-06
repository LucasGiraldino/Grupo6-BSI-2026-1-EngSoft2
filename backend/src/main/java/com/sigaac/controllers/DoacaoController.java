package com.sigaac.controllers;

import com.sigaac.dto.DoacaoRequestDTO;
import com.sigaac.model.Doacao;
import com.sigaac.service.DoacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doacoes")
@CrossOrigin(origins = "*") // Permite integração com o Vite no front
public class DoacaoController {

    @Autowired
    private DoacaoService doacaoService;

    @PostMapping
    public ResponseEntity<?> efetuarDoacao(@RequestBody DoacaoRequestDTO dto) {
        try {
            Doacao novaDoacao = doacaoService.efetuarDoacao(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaDoacao);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar e atualizar estoque para a doação.");
        }
    }
}