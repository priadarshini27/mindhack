package com.mindhack.score_service.dto;

public record LeaderboardEntry(String playerName, int score, String rank, int streak) {
}
