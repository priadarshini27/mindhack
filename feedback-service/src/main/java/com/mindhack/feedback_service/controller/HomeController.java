package com.mindhack.feedback_service.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "service", "feedback-service",
                "status", "running",
                "endpoints", new String[] {"/feedback/hint/{levelId}", "/feedback/explanation/{levelId}", "/feedback/analyze", "/health"});
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
