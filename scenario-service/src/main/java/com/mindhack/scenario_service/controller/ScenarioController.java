package com.mindhack.scenario_service.controller;

import org.springframework.web.bind.annotation.*;

import com.mindhack.scenario_service.service.ScenarioService;
import com.mindhack.scenario_service.model.Scenario;
import java.util.List;

@RestController
@RequestMapping("/scenario")
public class ScenarioController {

    private final ScenarioService service;

    public ScenarioController(ScenarioService service) {
        this.service = service;
    }

    @GetMapping("/{levelId}")
    public Scenario get(@PathVariable Long levelId) {
        return service.getScenario(levelId);
    }
    @GetMapping
    public List<Scenario> all() {
        return service.getAll();
    }

    @PostMapping
    public Scenario create(@RequestBody Scenario scenario) {
        return service.save(scenario);
    }
}
