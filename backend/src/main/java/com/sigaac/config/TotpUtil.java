package com.sigaac.config;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

public class TotpUtil {

    private static final int SECRET_SIZE = 20;
    private static final int CODE_DIGITS = 6;
    private static final int TIME_STEP = 30;
    private static final int WINDOW = 1;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateSecret() {
        byte[] buffer = new byte[SECRET_SIZE];
        secureRandom.nextBytes(buffer);
        return base32Encode(buffer);
    }

    public boolean validateCode(String secret, String code) {
        long currentTime = System.currentTimeMillis() / 1000L;
        long counter = currentTime / TIME_STEP;

        for (int i = -WINDOW; i <= WINDOW; i++) {
            long expected = generateTOTP(secret, counter + i);
            if (String.format("%06d", expected).equals(code)) {
                return true;
            }
        }
        return false;
    }

    public String getProvisioningUri(String email, String secret) {
        String issuer = "SIGAAC";
        return "otpauth://totp/"
                + uriEncode(issuer + ":" + email)
                + "?secret=" + secret
                + "&issuer=" + uriEncode(issuer)
                + "&algorithm=SHA1"
                + "&digits=" + CODE_DIGITS
                + "&period=" + TIME_STEP;
    }

    private long generateTOTP(String secret, long counter) {
        try {
            byte[] data = new byte[8];
            long value = counter;
            for (int i = 7; i >= 0; i--) {
                data[i] = (byte) (value & 0xFF);
                value >>= 8;
            }

            byte[] keyBytes = base32Decode(secret);
            Mac mac = Mac.getInstance("HmacSHA1");
            SecretKeySpec spec = new SecretKeySpec(keyBytes, "HmacSHA1");
            mac.init(spec);

            byte[] hash = mac.doFinal(data);

            int offset = hash[hash.length - 1] & 0xF;
            int binary = ((hash[offset] & 0x7F) << 24)
                    | ((hash[offset + 1] & 0xFF) << 16)
                    | ((hash[offset + 2] & 0xFF) << 8)
                    | (hash[offset + 3] & 0xFF);

            return binary % (int) Math.pow(10, CODE_DIGITS);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate TOTP code", e);
        }
    }

    private String base32Encode(byte[] data) {
        StringBuilder result = new StringBuilder();
        int bits = 0;
        int bitCount = 0;
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        for (byte b : data) {
            bits = (bits << 8) | (b & 0xFF);
            bitCount += 8;
            while (bitCount >= 5) {
                int index = (bits >> (bitCount - 5)) & 0x1F;
                result.append(alphabet.charAt(index));
                bitCount -= 5;
            }
        }
        if (bitCount > 0) {
            int index = (bits << (5 - bitCount)) & 0x1F;
            result.append(alphabet.charAt(index));
        }

        int padding = 8 - (result.length() % 8);
        if (padding != 8) {
            result.append("=".repeat(padding));
        }

        return result.toString();
    }

    private byte[] base32Decode(String encoded) {
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        String cleaned = encoded.replace("=", "").toUpperCase();
        byte[] output = new byte[cleaned.length() * 5 / 8];
        int bytePos = 0;
        int bits = 0;
        int bitCount = 0;

        for (int i = 0; i < cleaned.length(); i++) {
            int index = alphabet.indexOf(cleaned.charAt(i));
            if (index < 0) continue;
            bits = (bits << 5) | index;
            bitCount += 5;
            if (bitCount >= 8) {
                output[bytePos++] = (byte) ((bits >> (bitCount - 8)) & 0xFF);
                bitCount -= 8;
            }
        }
        return Arrays.copyOf(output, bytePos);
    }

    private String uriEncode(String value) {
        try {
            return java.net.URLEncoder.encode(value, "UTF-8").replace("+", "%20");
        } catch (Exception e) {
            return value;
        }
    }
}
