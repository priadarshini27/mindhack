package com.mindhack.level_service.controller;

import com.mindhack.level_service.model.Level;
import com.mindhack.level_service.service.LevelService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/level")
public class LevelController {

    private final LevelService service;

    public LevelController(LevelService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public Level getLevel(@PathVariable Long id) {
        return service.getLevel(id);
    }
    @GetMapping
    public List<Level> getLevels() {
        return service.getLevels();
    }
    @PostMapping
    public Level createLevel(@RequestBody Level level) {
        return service.saveLevel(level);
    }
}
