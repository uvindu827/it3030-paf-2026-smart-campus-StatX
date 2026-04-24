package com.paf_project.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This tells Spring Boot to serve files from your local uploads folder!
        // Change this line in WebConfig.java
        registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:D:/PAF assignment/it3030-paf-2026-smart-campus-StatX/backend/uploads/");
    }
}