package com.mindhack.score_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.mindhack.score_service.model.Score;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByUserId(Long userId);
    List<Score> findTop3ByOrderByTotalScoreDescStreakDesc();
}
