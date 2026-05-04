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
        List<ActionTrace> incorrectActions = actions.stream()
                .filter(action -> !action.isCorrect())
                .toList();

        Map<String, Long> weaknessCounts = incorrectActions.stream()
                .collect(Collectors.groupingBy(ActionTrace::getWeaknessCategory, Collectors.counting()));

        long repeatedCategories = weaknessCounts.values().stream().filter(count -> count > 1).count();
        long quickIncorrects = incorrectActions.stream().filter(action -> action.getDecisionTimeMs() > 0 && action.getDecisionTimeMs() < 2500).count();

        int riskScore = 100;
        riskScore -= incorrectActions.size() * 10;
        riskScore -= quickIncorrects * 5;
        riskScore -= Math.toIntExact(repeatedCategories * 6);
        riskScore -= weaknessCounts.entrySet().stream()
                .filter(entry -> entry.getValue() > 1)
                .mapToInt(entry -> Math.toIntExact((entry.getValue() - 1) * 4))
                .sum();
        riskScore = Math.max(0, Math.min(100, riskScore));

        String riskLevel;
        if (riskScore >= 75) {
            riskLevel = "Low";
        } else if (riskScore >= 45) {
            riskLevel = "Moderate";
        } else {
            riskLevel = "High";
        }

        AnalysisResponse.WeakestCategory weakestCategory;
        if (weaknessCounts.isEmpty()) {
            weakestCategory = new AnalysisResponse.WeakestCategory("None", "No incorrect weakness category was detected.");
        } else {
            String category = weaknessCounts.entrySet().stream()
                    .max((a, b) -> {
                        int compareCount = a.getValue().compareTo(b.getValue());
                        if (compareCount != 0) return compareCount;
                        long aQuick = incorrectActions.stream().filter(action -> action.getWeaknessCategory().equals(a.getKey()) && action.getDecisionTimeMs() > 0 && action.getDecisionTimeMs() < 2500).count();
                        long bQuick = incorrectActions.stream().filter(action -> action.getWeaknessCategory().equals(b.getKey()) && action.getDecisionTimeMs() > 0 && action.getDecisionTimeMs() < 2500).count();
                        return Long.compare(aQuick, bQuick);
                    })
                    .map(Map.Entry::getKey)
                    .orElse("Unknown");

            long categoryCount = weaknessCounts.getOrDefault(category, 0L);
            long categoryQuick = incorrectActions.stream().filter(action -> action.getWeaknessCategory().equals(category) && action.getDecisionTimeMs() > 0 && action.getDecisionTimeMs() < 2500).count();
            String reason = "This category was selected because it has " + categoryCount + " incorrect decision" + (categoryCount == 1 ? "" : "s") + ", with " + categoryQuick + " fast incorrect choice" + (categoryQuick == 1 ? "" : "s") + ".";
            weakestCategory = new AnalysisResponse.WeakestCategory(category, reason);
        }

        List<String> training = new java.util.ArrayList<>();
        if (weaknessCounts.containsKey("Phishing detection")) {
            training.add("Practice email sender and link verification drills.");
        }
        if (weaknessCounts.containsKey("Social engineering")) {
            training.add("Review social engineering scenarios and trust-but-verify habits.");
        }
        if (weaknessCounts.containsKey("Website spoofing")) {
            training.add("Train on identifying fake URLs and spoofed web pages.");
        }
        if (weaknessCounts.containsKey("Decision timing")) {
            training.add("Work on pacing decisions to avoid rushed responses.");
        }
        if (weaknessCounts.containsKey("Urgency handling")) {
            training.add("Focus on handling urgent requests without panic.");
        }
        if (training.isEmpty()) {
            training.add("Reinforce verification routines for emails, links and web pages.");
            training.add("Practice slowing down under time pressure.");
        }
        if (training.size() > 3) {
            training = training.subList(0, 3);
        }

        String coachingSummary;
        if (incorrectActions.isEmpty()) {
            coachingSummary = "Your actions are safe and consistent; keep verifying before you act.";
        } else {
            coachingSummary = "Repeated incorrect decisions and quick responses are driving risk; focus on the identified weakness category with deliberate verification.";
        }

        return new AnalysisResponse(riskScore, riskLevel, weakestCategory, training, coachingSummary);
    }
}
