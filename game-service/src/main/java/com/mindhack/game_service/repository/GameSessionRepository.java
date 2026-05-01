package com.mindhack.game_service.repository;

import com.mindhack.game_service.model.GameSession;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    Optional<GameSession> findTopByUserIdOrderByStartedAtDesc(Long userId);
}
