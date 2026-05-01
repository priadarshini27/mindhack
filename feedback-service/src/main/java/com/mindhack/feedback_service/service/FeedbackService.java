package com.mindhack.feedback_service.service;

import com.mindhack.feedback_service.dto.ActionTrace;
import com.mindhack.feedback_service.dto.AnalysisRequest;
import com.mindhack.feedback_service.dto.AnalysisResponse;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.mindhack.feedback_service.repository.FeedbackRepository;
import com.mindhack.feedback_service.model.Feedback;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    public List<Feedback> getHints(Long levelId) {
        return repo.findByLevelIdAndType(levelId, "HINT");
    }

    public List<Feedback> getExplanation(Long levelId) {
        return repo.findByLevelIdAndType(levelId, "EXPLANATION");
    }

    public String getResult(boolean correct) {
        return correct ? "Correct!" : "Wrong!";
    }

    public Feedback save(Feedback feedback) {
        return repo.save(feedback);
    }

    public AnalysisResponse analyze(AnalysisRequest request) {
        List<ActionTrace> actions = request.getActions() == null ? List.of() : request.getActions();
        Map<String, Long> weaknesses = actions.stream()
                .filter(action -> !action.isCorrect())
                .collect(Collectors.groupingBy(ActionTrace::getWeaknessCategory, Collectors.counting()));
        List<String> repeated = weaknesses.entrySet().stream()
                .filter(entry -> entry.getValue() > 1)
                .map(Map.Entry::getKey)
                .toList();
        boolean rushed = actions.stream().filter(action -> action.getDecisionTimeMs() > 0).anyMatch(action -> action.getDecisionTimeMs() < 2500);
        boolean timeoutRisk = actions.stream().anyMatch(action -> "Decision timing".equalsIgnoreCase(action.getWeaknessCategory()));
        List<String> patterns = new java.util.ArrayList<>();
        if (rushed) {
            patterns.add("Rushed decisions under pressure");
        }
        if (timeoutRisk) {
            patterns.add("Timer pressure reduced verification quality");
        }
        if (weaknesses.containsKey("Phishing detection")) {
            patterns.add("Sender and link inspection needs reinforcement");
        }
        String summary = repeated.isEmpty()
                ? "Strong defensive baseline. Keep verifying senders, links, and website authenticity before acting."
                : "Focus next practice on " + String.join(", ", repeated) + " with slower verification before action.";
        return new AnalysisResponse(repeated, patterns, weaknesses, summary);
    }
}
