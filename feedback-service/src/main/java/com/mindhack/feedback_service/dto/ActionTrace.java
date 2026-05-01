package com.mindhack.feedback_service.dto;

public class ActionTrace {
    private Long levelId;
    private boolean correct;
    private String weaknessCategory;
    private long decisionTimeMs;

    public Long getLevelId() { return levelId; }
    public void setLevelId(Long levelId) { this.levelId = levelId; }
    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }
    public String getWeaknessCategory() { return weaknessCategory; }
    public void setWeaknessCategory(String weaknessCategory) { this.weaknessCategory = weaknessCategory; }
    public long getDecisionTimeMs() { return decisionTimeMs; }
    public void setDecisionTimeMs(long decisionTimeMs) { this.decisionTimeMs = decisionTimeMs; }
}
