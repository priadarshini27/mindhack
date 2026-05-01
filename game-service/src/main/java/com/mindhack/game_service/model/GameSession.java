package com.mindhack.game_service.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GameSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private int currentLevel = 1;
    private int totalScore;
    private int lifelines = 3;
    private int streak;
    private String status = "ACTIVE";
    private Instant startedAt = Instant.now();
    @ElementCollection
    private List<Integer> levelScores = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public int getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(int currentLevel) { this.currentLevel = currentLevel; }
    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public int getLifelines() { return lifelines; }
    public void setLifelines(int lifelines) { this.lifelines = lifelines; }
    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public List<Integer> getLevelScores() { return levelScores; }
    public void setLevelScores(List<Integer> levelScores) { this.levelScores = levelScores; }
}
