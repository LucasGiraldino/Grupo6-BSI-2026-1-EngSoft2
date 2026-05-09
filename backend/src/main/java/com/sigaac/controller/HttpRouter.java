package com.sigaac.controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HttpRouter implements HttpHandler {

    private final List<Route> routes = new ArrayList<>();

    public void get(String path, RouteHandler handler) {
        addRoute("GET", path, handler);
    }

    public void post(String path, RouteHandler handler) {
        addRoute("POST", path, handler);
    }

    public void put(String path, RouteHandler handler) {
        addRoute("PUT", path, handler);
    }

    public void delete(String path, RouteHandler handler) {
        addRoute("DELETE", path, handler);
    }

    private void addRoute(String method, String path, RouteHandler handler) {
        String regex = path.replaceAll("\\{([^/]+)}", "([^/]+)");
        Pattern pattern = Pattern.compile("^" + regex + "$");
        routes.add(new Route(method, pattern, handler));
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String requestMethod = exchange.getRequestMethod().toUpperCase();
        String requestPath = exchange.getRequestURI().getRawPath();
        if (requestPath.endsWith("/") && requestPath.length() > 1) {
            requestPath = requestPath.substring(0, requestPath.length() - 1);
        }

        for (Route route : routes) {
            if (!route.method.equals(requestMethod)) continue;
            Matcher matcher = route.pattern.matcher(requestPath);
            if (matcher.matches()) {
                Map<String, String> pathParams = new HashMap<>();
                for (int i = 1; i <= matcher.groupCount(); i++) {
                    pathParams.put("p" + i, matcher.group(i));
                }
                try {
                    route.handler.handle(exchange, pathParams);
                    return;
                } catch (Exception e) {
                    e.printStackTrace();
                    String error = "{\"error\":\"" + e.getMessage() + "\"}";
                    byte[] bytes = error.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(500, bytes.length);
                    exchange.getResponseBody().write(bytes);
                    exchange.getResponseBody().close();
                    return;
                }
            }
        }

        String notFound = "{\"error\":\"Rota nao encontrada: " + requestMethod + " " + requestPath + "\"}";
        byte[] bytes = notFound.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(404, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.getResponseBody().close();
    }

    static class Route {
        final String method;
        final Pattern pattern;
        final RouteHandler handler;

        Route(String method, Pattern pattern, RouteHandler handler) {
            this.method = method;
            this.pattern = pattern;
            this.handler = handler;
        }
    }

    @FunctionalInterface
    public interface RouteHandler {
        void handle(HttpExchange exchange, Map<String, String> pathParams) throws Exception;
    }
}
