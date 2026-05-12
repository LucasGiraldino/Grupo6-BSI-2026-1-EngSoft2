package com.sigaac.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private final SecureRandom secureRandom = new SecureRandom();
    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public OtpService() {}

    public String generateOtp(String email) {
        String code = String.format("%06d", secureRandom.nextInt(1000000));
        OtpEntry entry = new OtpEntry(code, Instant.now().plusSeconds(300), 0);
        otpStore.put(email, entry);

        logger.info("OTP para {}: {}", email, code);
        return code;
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
