package com.mindhack.game_service.controller;

import com.mindhack.game_service.dto.GameActionRequest;
import com.mindhack.game_service.dto.MissionBundle;
import com.mindhack.game_service.model.GameSession;
import com.mindhack.game_service.service.GameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/game")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @GetMapping("/level/{id}")
    public Object getLevel(@PathVariable Long id) {
        return service.getLevel(id);
    }

    @PostMapping("/start/{userId}")
    public GameSession start(@PathVariable Long userId) {
        return service.start(userId);
    }

    @GetMapping("/mission/{id}")
    public MissionBundle mission(@PathVariable Long id) {
        return service.mission(id);
    }

    @PostMapping("/answer")
    public Boolean check(
            @RequestParam String answer,
            @RequestParam String correct) {

        return service.checkAnswer(answer, correct);
    }

    @PostMapping("/action")
    public GameSession action(@RequestBody GameActionRequest request) {
        return service.action(request);
    }
}
