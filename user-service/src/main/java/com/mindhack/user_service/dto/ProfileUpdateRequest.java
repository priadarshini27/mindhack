package com.mindhack.user_service.dto;

public class ProfileUpdateRequest {
    private int score;
    private String rank;
    private boolean correctDecision;

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }
    public boolean isCorrectDecision() { return correctDecision; }
    public void setCorrectDecision(boolean correctDecision) { this.correctDecision = correctDecision; }
}
