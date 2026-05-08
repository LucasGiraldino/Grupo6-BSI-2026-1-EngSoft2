package com.sigaac.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private final ConcurrentHashMap<String, RateLimitEntry> requestCounts = new ConcurrentHashMap<>();

    private static final int MAX_ATTEMPTS = 5;
    private static final int WINDOW_SECONDS = 300;

    public boolean isAllowed(String key) {
        Instant now = Instant.now();
        RateLimitEntry entry = requestCounts.get(key);

        if (entry == null || now.isAfter(entry.windowReset)) {
            requestCounts.put(key, new RateLimitEntry(1, now.plusSeconds(WINDOW_SECONDS)));
            return true;
        }

        entry.count++;
        if (entry.count > MAX_ATTEMPTS) {
            return false;
        }
        return true;
    }

    public void reset(String key) {
        requestCounts.remove(key);
    }

    private static class RateLimitEntry {
        int count;
        Instant windowReset;

        RateLimitEntry(int count, Instant windowReset) {
            this.count = count;
            this.windowReset = windowReset;
        }
    }
}
