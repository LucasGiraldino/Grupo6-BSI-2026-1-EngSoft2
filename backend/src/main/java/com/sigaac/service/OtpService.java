package com.sigaac.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final JavaMailSender mailSender;
    private final ConcurrentHashMap<String, OtpEntry> otpCache = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();
    
    private static final int MAX_ATTEMPTS = 3;
    private static final int EXPIRATION_MINUTES = 5;

    public OtpService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateAndSendOtp(String email) {
        String otp = String.format("%06d", secureRandom.nextInt(999999));
        otpCache.put(email, new OtpEntry(otp, Instant.now().plusSeconds(EXPIRATION_MINUTES * 60), 0));
        
        if (mailSender != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Seu código de verificação - SIGAAC");
            message.setText("Seu código de autenticação é: " + otp + "\n\nEle expira em " + EXPIRATION_MINUTES + " minutos.");
            
            try {
                mailSender.send(message);
            } catch (Exception e) {
            }
        }

        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpCache.get(email);
        if (entry == null) {
            return false;
        }
        
        if (entry.attempts >= MAX_ATTEMPTS) {
            otpCache.remove(email);
            return false;
        }
        
        if (Instant.now().isAfter(entry.expiresAt)) {
            otpCache.remove(email);
            return false;
        }
        
        entry.attempts++;
        
        if (entry.code.equals(otp)) {
            otpCache.remove(email);
            return true;
        }
        
        if (entry.attempts >= MAX_ATTEMPTS) {
            otpCache.remove(email);
        }
        
        return false;
    }
    
    private static class OtpEntry {
        String code;
        Instant expiresAt;
        int attempts;
        
        OtpEntry(String code, Instant expiresAt, int attempts) {
            this.code = code;
            this.expiresAt = expiresAt;
            this.attempts = attempts;
        }
    }
}
