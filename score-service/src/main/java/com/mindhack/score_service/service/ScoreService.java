package com.mindhack.score_service.service;

import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.mindhack.score_service.repository.ScoreRepository;
import com.mindhack.score_service.model.Score;

@Service
public class ScoreService {

    private final ScoreRepository repo;

    public ScoreService(ScoreRepository repo) {
        this.repo = repo;
    }

    public Score save(Score score) {
        score.setRankName(rank(score.getTotalScore()));
        return repo.save(score);
    }

    public List<Score> getUserScores(Long userId) {
        return repo.findByUserId(userId);
    }

    /** Top 3 players, using each player's best row (a row is saved for every action). */
    public List<Score> leaderboard() {
        Set<Object> seen = new HashSet<>();
        return repo.findAllByOrderByTotalScoreDescStreakDesc().stream()
                .filter(score -> seen.add(score.getUserId() != null ? score.getUserId() : score.getPlayerName()))
                .limit(3)
                .toList();
    }

    public String rank(int totalScore) {
        if (totalScore >= 650) {
            return "Cyber Defender Elite";
        }
        if (totalScore >= 450) {
            return "Expert";
        }
        if (totalScore >= 250) {
            return "Intermediate";
        }
        return "Beginner";
    }
}
