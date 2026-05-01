package com.mindhack.feedback_service.dto;

import java.util.List;
import java.util.Map;

public record AnalysisResponse(List<String> repeatedMistakes, List<String> behaviorPatterns, Map<String, Long> weaknessCategories, String coachingSummary) {
}
