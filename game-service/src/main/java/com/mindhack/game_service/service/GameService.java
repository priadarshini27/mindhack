package com.mindhack.game_service.service;

import com.mindhack.game_service.dto.GameActionRequest;
import com.mindhack.game_service.dto.MissionBundle;
import com.mindhack.game_service.model.GameSession;
import com.mindhack.game_service.repository.GameSessionRepository;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GameService {
    private final GameSessionRepository repository;
    private final RestTemplate rest = new RestTemplate();

    @Value("${service.level.url}")
    private String levelUrl;
    @Value("${service.scenario.url}")
    private String scenarioUrl;
    @Value("${service.answer.url}")
    private String answerUrl;
    @Value("${service.score.url}")
    private String scoreUrl;
    @Value("${service.user.url}")
    private String userUrl;

    public GameService(GameSessionRepository repository) {
        this.repository = repository;
    }

    public GameSession start(Long userId) {
        GameSession session = new GameSession();
        session.setUserId(userId);
        return repository.save(session);
    }

    public MissionBundle mission(Long id) {
        return new MissionBundle(getLevel(id), rest.getForObject(scenarioUrl + "/scenario/" + id, Object.class));
    }

    public Object getLevel(Long id) {
        return rest.getForObject(levelUrl + "/level/" + id, Object.class);
    }

    private void syncUserProfile(Long userId, int totalScore, boolean correct) {
        if (userId == null) {
            return;
        }

        try {
            rest.exchange(
                    userUrl + "/users/" + userId + "/progress",
                    HttpMethod.PUT,
                    new HttpEntity<>(Map.of(
                            "score", totalScore,
                            "rank", determineRank(totalScore),
                            "correctDecision", correct)),
                    Object.class);
        } catch (Exception ex) {
            // log and continue; score service update should not break game action flow
            System.err.println("Warning: failed to sync user profile progress for user " + userId + ": " + ex.getMessage());
        }
    }

    private String determineRank(int score) {
        if (score < 500) return "Beginner";
        if (score < 1000) return "Intermediate";
        if (score < 2000) return "Expert";
        return "Cyber Defender Elite";
    }

    public Boolean checkAnswer(String answer, String correct) {
        String url = answerUrl + "/answer/check?answer=" + answer + "&correct=" + correct;
        return rest.postForObject(url, null, Boolean.class);
    }

    public GameSession action(GameActionRequest request) {
        Map<?, ?> evaluation = rest.postForObject(answerUrl + "/answer/evaluate", request, Map.class);
        boolean correct = Boolean.TRUE.equals(evaluation == null ? false : evaluation.get("correct"));
        GameSession session = repository.findById(request.getSessionId()).orElseGet(() -> start(request.getUserId()));
        int scoreDelta = correct ? Math.max(0, request.getScoreDelta()) : 0;
        session.setTotalScore(session.getTotalScore() + scoreDelta);
        session.setStreak(correct ? session.getStreak() + 1 : 0);
        if (!correct) {
            session.setLifelines(Math.max(0, session.getLifelines() - 1));
            if (session.getLifelines() == 0) {
                session.setStatus("FAILED");
            }
        }
        session.getLevelScores().add(scoreDelta);
        session.setCurrentLevel(Math.min(5, request.getLevelId().intValue() + 1));
        if (request.getLevelId() >= 5) {
            session.setStatus("COMPLETED");
        }
        GameSession saved = repository.save(session);
        rest.postForObject(scoreUrl + "/score/update", Map.of(
                "userId", request.getUserId(),
                "playerName", request.getPlayerName() == null ? "Operator" : request.getPlayerName(),
                "levelId", request.getLevelId(),
                "score", scoreDelta,
                "totalScore", saved.getTotalScore(),
                "streak", saved.getStreak()), Object.class);
        syncUserProfile(request.getUserId(), saved.getTotalScore(), correct);
        return saved;
    }
}
