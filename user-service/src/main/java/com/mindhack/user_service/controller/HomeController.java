package com.mindhack.user_service.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "service", "user-service",
                "status", "running",
                "endpoints", new String[] {"/users/signup", "/users/login", "/users/me", "/health"});
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
