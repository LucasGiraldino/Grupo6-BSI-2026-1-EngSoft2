package com.sigaac.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final JavaMailSender mailSender;
    private final ConcurrentHashMap<String, String> otpCache = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public OtpService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpCache.put(email, otp);
        
        System.out.println("2FA OTP CODE for " + email + " is: " + otp);
        
        if (mailSender != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Seu código de verificação - SIGAAC");
            message.setText("Seu código de autenticação é: " + otp + "\n\nEle expira em 5 minutos.");
            
            try {
                mailSender.send(message);
            } catch (Exception e) {
                System.out.println("Erro ao enviar email. Código gerado é: " + otp);
            }
        }

        scheduler.schedule(() -> otpCache.remove(email), 5, TimeUnit.MINUTES);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        String storedOtp = otpCache.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpCache.remove(email);
            return true;
        }
        return false;
    }
}
