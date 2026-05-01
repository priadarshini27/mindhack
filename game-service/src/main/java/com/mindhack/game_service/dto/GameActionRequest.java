package com.mindhack.game_service.dto;

public class GameActionRequest {
    private Long userId;
    private Long sessionId;
    private Long levelId;
    private String action;
    private String expectedAction;
    private String weaknessCategory;
    private int scoreDelta;
    private long decisionTimeMs;
    private String playerName;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public Long getLevelId() { return levelId; }
    public void setLevelId(Long levelId) { this.levelId = levelId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getExpectedAction() { return expectedAction; }
    public void setExpectedAction(String expectedAction) { this.expectedAction = expectedAction; }
    public String getWeaknessCategory() { return weaknessCategory; }
    public void setWeaknessCategory(String weaknessCategory) { this.weaknessCategory = weaknessCategory; }
    public int getScoreDelta() { return scoreDelta; }
    public void setScoreDelta(int scoreDelta) { this.scoreDelta = scoreDelta; }
    public long getDecisionTimeMs() { return decisionTimeMs; }
    public void setDecisionTimeMs(long decisionTimeMs) { this.decisionTimeMs = decisionTimeMs; }
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
}
