package com.sigaac.controllers;

import com.sigaac.model.User;
import com.sigaac.model.UserRole;
import com.sigaac.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/apis/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/{id}/perfil")
    public ResponseEntity<String> changeUserProfile(@PathVariable Integer id,
            @RequestBody Map<String, String> payload) {
        String novoPerfil = payload.get("perfil");
        if (novoPerfil == null || novoPerfil.isEmpty()) {
            return ResponseEntity.badRequest().body("Perfil inválido.");
        }

        return userRepository.findById(id).map(user -> {
            user.setPerfil(UserRole.valueOf(novoPerfil.toUpperCase()));
            userRepository.save(user);
            return ResponseEntity.ok("Perfil atualizado com sucesso para: " + novoPerfil);
        }).orElse(ResponseEntity.notFound().build());
    }
}
