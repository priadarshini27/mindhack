package com.mindhack.answer_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

@Entity
public class AnswerAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long levelId;
    private String action;
    private String expectedAction;
    private boolean correct;
    private String weaknessCategory;
    private long decisionTimeMs;
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getLevelId() { return levelId; }
    public void setLevelId(Long levelId) { this.levelId = levelId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getExpectedAction() { return expectedAction; }
    public void setExpectedAction(String expectedAction) { this.expectedAction = expectedAction; }
    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }
    public String getWeaknessCategory() { return weaknessCategory; }
    public void setWeaknessCategory(String weaknessCategory) { this.weaknessCategory = weaknessCategory; }
    public long getDecisionTimeMs() { return decisionTimeMs; }
    public void setDecisionTimeMs(long decisionTimeMs) { this.decisionTimeMs = decisionTimeMs; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
