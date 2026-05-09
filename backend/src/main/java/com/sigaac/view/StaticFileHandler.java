package com.sigaac.view;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

public class StaticFileHandler implements HttpHandler {

    private final Path distPath;
    private final Map<String, String> spaRoutes = Map.of(
            "/configuracao", "/configuracao.html",
            "/dashboard", "/dashboard.html",
            "/pacientes", "/pacientes.html"
    );

    public StaticFileHandler(String distDirectory) {
        this.distPath = new File(distDirectory).toPath();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getRawPath();

        String mapped = spaRoutes.get(path);
        if (mapped != null) {
            path = mapped;
        }

        Path filePath = distPath.resolve(path.startsWith("/") ? path.substring(1) : path);

        if (!Files.exists(filePath) || Files.isDirectory(filePath)) {
            filePath = distPath.resolve("index.html");
        }

        byte[] bytes = Files.readAllBytes(filePath);
        String contentType = getContentType(filePath.toString());
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(200, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private String getContentType(String filename) {
        if (filename.endsWith(".html")) return "text/html; charset=utf-8";
        if (filename.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (filename.endsWith(".css")) return "text/css; charset=utf-8";
        if (filename.endsWith(".png")) return "image/png";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
        if (filename.endsWith(".svg")) return "image/svg+xml";
        if (filename.endsWith(".ico")) return "image/x-icon";
        if (filename.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }
}
