package com.sigaac.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private final SecureRandom secureRandom = new SecureRandom();
    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final Properties mailProps;
    private final String mailHost;
    private final int mailPort;

    public OtpService(Properties props) {
        this.mailProps = props;
        this.mailHost = props.getProperty("spring.mail.host", "localhost");
        this.mailPort = Integer.parseInt(props.getProperty("spring.mail.port", "1025"));
    }

    public void generateAndSendOtp(String email) {
        String code = String.format("%06d", secureRandom.nextInt(1000000));
        OtpEntry entry = new OtpEntry(code, Instant.now().plusSeconds(300), 0);
        otpStore.put(email, entry);

        try {
            sendEmail(email, code);
        } catch (Exception e) {
            logger.warn("Falha ao enviar email para {}: {}", email, e.getMessage());
        }
        logger.info("OTP para {}: {}", email, code);
    }

    public boolean validateOtp(String email, String code) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiry)) {
            otpStore.remove(email);
            return false;
        }
        if (entry.attempts >= 3) {
            otpStore.remove(email);
            return false;
        }
        entry.attempts++;
        if (entry.code.equals(code)) {
            otpStore.remove(email);
            return true;
        }
        return false;
    }

    private void sendEmail(String to, String code) throws MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.host", mailHost);
        props.put("mail.smtp.port", mailPort);

        Session session = Session.getInstance(props);
        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress("noreply@sigaac.com"));
        msg.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
        msg.setSubject("Código de verificação SIGAAC");
        msg.setText("Seu código de verificação é: " + code);
        Transport.send(msg);
    }

    private static class OtpEntry {
        final String code;
        final Instant expiry;
        int attempts;

        OtpEntry(String code, Instant expiry, int attempts) {
            this.code = code;
            this.expiry = expiry;
            this.attempts = attempts;
        }
    }
}
