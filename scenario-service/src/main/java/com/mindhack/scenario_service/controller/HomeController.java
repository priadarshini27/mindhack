package com.mindhack.scenario_service.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "service", "scenario-service",
                "status", "running",
                "endpoints", new String[] {"/scenario", "/scenario/{levelId}", "/health"});
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
