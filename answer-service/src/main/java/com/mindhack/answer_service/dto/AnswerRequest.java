package com.mindhack.answer_service.dto;

public class AnswerRequest {
    private Long userId;
    private Long levelId;
    private String action;
    private String expectedAction;
    private String weaknessCategory;
    private long decisionTimeMs;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getLevelId() { return levelId; }
    public void setLevelId(Long levelId) { this.levelId = levelId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getExpectedAction() { return expectedAction; }
    public void setExpectedAction(String expectedAction) { this.expectedAction = expectedAction; }
    public String getWeaknessCategory() { return weaknessCategory; }
    public void setWeaknessCategory(String weaknessCategory) { this.weaknessCategory = weaknessCategory; }
    public long getDecisionTimeMs() { return decisionTimeMs; }
    public void setDecisionTimeMs(long decisionTimeMs) { this.decisionTimeMs = decisionTimeMs; }
}
