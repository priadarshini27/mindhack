package com.mindhack.score_service.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.mindhack.score_service.service.ScoreService;
import com.mindhack.score_service.model.Score;

@RestController
@RequestMapping("/score")
public class ScoreController {

    private final ScoreService service;

    public ScoreController(ScoreService service) {
        this.service = service;
    }

    @PostMapping("/update")
    public Score update(@RequestBody Score score) {
        return service.save(score);
    }

    @GetMapping("/{userId}")
    public List<Score> get(@PathVariable Long userId) {
        return service.getUserScores(userId);
    }

    @GetMapping("/leaderboard")
    public List<Score> leaderboard() {
        return service.leaderboard();
    }

    @GetMapping("/rank/{score}")
    public String rank(@PathVariable int score) {
        return service.rank(score);
    }
}
