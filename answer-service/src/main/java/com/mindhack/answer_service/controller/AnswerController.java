package com.mindhack.answer_service.controller;

import com.mindhack.answer_service.dto.AnswerRequest;
import com.mindhack.answer_service.dto.AnswerResponse;
import com.mindhack.answer_service.model.AnswerAttempt;
import com.mindhack.answer_service.service.AnswerService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/answer")
public class AnswerController {

    private final AnswerService service;

    public AnswerController(AnswerService service) {
        this.service = service;
    }

    @PostMapping("/check")
    public boolean check(
            @RequestParam String answer,
            @RequestParam String correct) {

        return service.checkAnswer(answer, correct);
    }

    @PostMapping("/evaluate")
    public AnswerResponse evaluate(@RequestBody AnswerRequest request) {
        return service.evaluate(request);
    }

    @GetMapping("/attempts/{userId}")
    public List<AnswerAttempt> attempts(@PathVariable Long userId) {
        return service.attempts(userId);
    }
}
