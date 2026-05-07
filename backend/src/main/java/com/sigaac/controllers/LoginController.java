package com.sigaac.controllers;

import com.sigaac.dto.LoginRequestDTO;
import com.sigaac.dto.VerifyRequestDTO;
import com.sigaac.model.User;
import com.sigaac.service.OtpService;
import com.sigaac.service.RateLimiterService;
import com.sigaac.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OtpService otpService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private RateLimiterService rateLimiterService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        String rateLimitKey = "login:" + data.email();
        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            return ResponseEntity.status(429).body(Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
        }

        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            
            var user = (User) auth.getPrincipal();
            otpService.generateAndSendOtp(user.getEmail());
            
            return ResponseEntity.ok(Map.of("message", "Código 2FA enviado para o email do usuário.", "otpSent", true));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciais inválidas"));
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Conta desabilitada"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyRequestDTO data) {
        String rateLimitKey = "verify:" + data.email();
        if (!rateLimiterService.isAllowed(rateLimitKey)) {
            return ResponseEntity.status(429).body(Map.of("error", "Muitas tentativas. Aguarde 5 minutos."));
        }

        boolean isValid = otpService.validateOtp(data.email(), data.codigo());
        if (isValid) {
            var auth = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(data.email(), data.senha())
            );
            var user = (User) auth.getPrincipal();
            user.resetFailedAttempts();
            
            String token = tokenService.generateToken(user);
            String refreshToken = tokenService.generateRefreshToken(user);
            
            rateLimiterService.reset(rateLimitKey);
            
            return ResponseEntity.ok(Map.of(
                    "accessToken", token,
                    "refreshToken", refreshToken,
                    "expiresIn", 7200
            ));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Código inválido ou expirado"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || !tokenService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "Refresh token inválido"));
        }

        String email = tokenService.validateToken(refreshToken);
        var user = (User) this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, null)
        ).getPrincipal();

        String newToken = tokenService.generateToken(user);
        return ResponseEntity.ok(Map.of("accessToken", newToken, "expiresIn", 7200));
    }
}
