package com.sigaac.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve React app in production
        registry.addResourceHandler("/**")
                .addResourceLocations("file:/Users/lucasgiraldino/estudos/Grupo6-BSI-2026-1-EngSoft2/frontend/dist/")
                .resourceChain(true);
    }
}
