package com.mindhack.user_service.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String passwordHash;
    private String sessionToken;
    private boolean oathCompleted;
    private int currentStreak;
    private int bestStreak;
    private int consecutiveCorrect;
    private int bestScore;
    private String latestRank = "Beginner";
    private LocalDate lastLoginDate;
    @ElementCollection
    private List<String> rankHistory = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
    public boolean isOathCompleted() { return oathCompleted; }
    public void setOathCompleted(boolean oathCompleted) { this.oathCompleted = oathCompleted; }
    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
    public int getBestStreak() { return bestStreak; }
    public void setBestStreak(int bestStreak) { this.bestStreak = bestStreak; }
    public int getConsecutiveCorrect() { return consecutiveCorrect; }
    public void setConsecutiveCorrect(int consecutiveCorrect) { this.consecutiveCorrect = consecutiveCorrect; }
    public int getBestScore() { return bestScore; }
    public void setBestScore(int bestScore) { this.bestScore = bestScore; }
    public String getLatestRank() { return latestRank; }
    public void setLatestRank(String latestRank) { this.latestRank = latestRank; }
    public LocalDate getLastLoginDate() { return lastLoginDate; }
    public void setLastLoginDate(LocalDate lastLoginDate) { this.lastLoginDate = lastLoginDate; }
    public List<String> getRankHistory() { return rankHistory; }
    public void setRankHistory(List<String> rankHistory) { this.rankHistory = rankHistory; }
}
