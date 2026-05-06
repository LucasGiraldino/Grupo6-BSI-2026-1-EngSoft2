package com.sigaac.controllers;

import com.sigaac.dto.LoginRequestDTO;
import com.sigaac.dto.VerifyRequestDTO;
import com.sigaac.model.User;
import com.sigaac.service.OtpService;
import com.sigaac.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OtpService otpService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        
        var user = (User) auth.getPrincipal();
        otpService.generateAndSendOtp(user.getEmail());
        
        return ResponseEntity.ok("Código 2FA enviado para o email do usuário.");
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody VerifyRequestDTO data) {
        boolean isValid = otpService.validateOtp(data.email(), data.codigo());
        if (isValid) {
            var user = (User) this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(data.email(), data.senha())
            ).getPrincipal();
            
            String token = tokenService.generateToken(user);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Código inválido ou expirado.");
    }
}
