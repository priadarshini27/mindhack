package com.mindhack.score_service.service;

import org.springframework.stereotype.Service;
import java.util.List;

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

    public List<Score> leaderboard() {
        return repo.findTop3ByOrderByTotalScoreDescStreakDesc();
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
