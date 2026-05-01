package com.mindhack.feedback_service.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.mindhack.feedback_service.dto.AnalysisRequest;
import com.mindhack.feedback_service.dto.AnalysisResponse;
import com.mindhack.feedback_service.service.FeedbackService;
import com.mindhack.feedback_service.model.Feedback;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @GetMapping("/hint/{levelId}")
    public List<Feedback> hints(@PathVariable Long levelId) {
        return service.getHints(levelId);
    }

    @GetMapping("/explanation/{levelId}")
    public List<Feedback> explanation(@PathVariable Long levelId) {
        return service.getExplanation(levelId);
    }

    @GetMapping("/result/{value}")
    public String result(@PathVariable boolean value) {
        return service.getResult(value);
    }

    @PostMapping
    public Feedback create(@RequestBody Feedback feedback) {
        return service.save(feedback);
    }

    @PostMapping("/analyze")
    public AnalysisResponse analyze(@RequestBody AnalysisRequest request) {
        return service.analyze(request);
    }
}
