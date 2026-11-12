package com.mindhack.score_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

import com.mindhack.score_service.service.ScoreService;
import com.mindhack.score_service.model.Score;

@RestController
@RequestMapping("/score")
public class ScoreController {

    private final ScoreService service;
    private final byte[] internalApiKey;

    public ScoreController(ScoreService service, @Value("${internal.api-key}") String internalApiKey) {
        this.service = service;
        this.internalApiKey = internalApiKey.getBytes(StandardCharsets.UTF_8);
    }

    /** Called by game-service only; protected by the shared internal API key. */
    @PostMapping("/update")
    public Score update(@RequestHeader(value = "X-Internal-Key", required = false) String key, @RequestBody Score score) {
        if (key == null || !MessageDigest.isEqual(key.getBytes(StandardCharsets.UTF_8), internalApiKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Internal endpoint");
        }
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
