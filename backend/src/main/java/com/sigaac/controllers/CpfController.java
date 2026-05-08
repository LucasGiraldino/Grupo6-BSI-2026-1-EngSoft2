package com.sigaac.controllers;

import com.sigaac.dto.CpfResponseDTO;
import com.sigaac.service.CpfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consulta-cpf")
public class CpfController {

    @Autowired
    private CpfService cpfService;

    @GetMapping("/{cpf}")
    public ResponseEntity<CpfResponseDTO> consultar(@PathVariable String cpf) {
        String digitos = cpf.replaceAll("\\D", "");
        if (digitos.length() != 11) {
            return ResponseEntity.badRequest().body(
                CpfResponseDTO.invalido(digitos, "CPF deve conter 11 d\u00edgitos.")
            );
        }
        CpfResponseDTO response = cpfService.consultar(digitos);
        return ResponseEntity.ok(response);
    }
}
