package com.mindhack.game_service.service;

import com.mindhack.game_service.dto.GameActionRequest;
import com.mindhack.game_service.dto.MissionBundle;
import com.mindhack.game_service.model.GameSession;
import com.mindhack.game_service.repository.GameSessionRepository;
import java.util.ArrayList;
import java.util.Arrays;
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
        session.setLevelScores(new ArrayList<>(Arrays.asList(0, 0, 0, 0, 0)));
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
            System.err.println("Warning: failed to sync user profile progress for user " + userId + ": " + ex.getMessage());
        }
    }

    private String determineRank(int score) {
        if (score >= 650) return "Cyber Defender Elite";
        if (score >= 450) return "Expert";
        if (score >= 250) return "Intermediate";
        return "Beginner";
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
        if (!correct && !request.isShielded()) {
            loseLifeline(session);
        }
        addLevelScore(session, request.getLevelId(), scoreDelta);
        if (request.isLevelComplete()) {
            session.setCurrentLevel(Math.min(5, request.getLevelId().intValue() + 1));
        }
        if (request.isLevelComplete() && request.getLevelId() >= 5) {
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

    public GameSession useLifeline(Long sessionId) {
        GameSession session = repository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
        loseLifeline(session);
        return repository.save(session);
    }

    private void loseLifeline(GameSession session) {
        session.setLifelines(Math.max(0, session.getLifelines() - 1));
        if (session.getLifelines() == 0) {
            session.setStatus("FAILED");
        }
    }

    private void addLevelScore(GameSession session, Long levelId, int scoreDelta) {
        int index = Math.max(0, levelId.intValue() - 1);
        if (session.getLevelScores() == null) {
            session.setLevelScores(new ArrayList<>());
        }
        while (session.getLevelScores().size() < 5 || session.getLevelScores().size() <= index) {
            session.getLevelScores().add(0);
        }
        session.getLevelScores().set(index, session.getLevelScores().get(index) + scoreDelta);
    }
}
