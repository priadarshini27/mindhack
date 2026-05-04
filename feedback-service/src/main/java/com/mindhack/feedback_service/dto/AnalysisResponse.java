package com.mindhack.feedback_service.dto;

import java.util.List;

public record AnalysisResponse(
        int riskScore,
        String riskLevel,
        WeakestCategory weakestCategory,
        List<String> recommendedTraining,
        String coachingSummary
) {
    public static record WeakestCategory(String name, String reason) {}
}
