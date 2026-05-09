package com.sigaac.model;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimiterService {

    private final ConcurrentHashMap<String, RateLimitEntry> store = new ConcurrentHashMap<>();
    private final int maxRequests = 5;
    private final long windowMinutes = 5;

    public boolean isAllowed(String key) {
        RateLimitEntry entry = store.computeIfAbsent(key, k -> new RateLimitEntry(Instant.now(), 0));
        if (Instant.now().isAfter(entry.windowStart.plusSeconds(windowMinutes * 60))) {
            entry.windowStart = Instant.now();
            entry.count = 0;
        }
        entry.count++;
        return entry.count <= maxRequests;
    }

    public void reset(String key) {
        store.remove(key);
    }

    private static class RateLimitEntry {
        Instant windowStart;
        int count;

        RateLimitEntry(Instant windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
