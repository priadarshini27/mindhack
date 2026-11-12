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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GameService {
    private static final String INTERNAL_KEY_HEADER = "X-Internal-Key";

    /**
     * Highest score each level can award (index 0 = level 1). Must match the frontend levels:
     * L1 5 emails x 20, L2 block OTP 200, L3 250 + 40s x 2, L4 300, L5 500.
     */
    private static final int[] LEVEL_MAX_SCORE = {100, 200, 330, 300, 500};

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
    @Value("${internal.api-key}")
    private String internalApiKey;

    public GameService(GameSessionRepository repository) {
        this.repository = repository;
    }

    public GameSession start(Long userId, String authorization) {
        requireCaller(userId, authorization);
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

    public Boolean checkAnswer(String answer, String correct) {
        String url = UriComponentsBuilder.fromUriString(answerUrl + "/answer/check")
                .queryParam("answer", answer)
                .queryParam("correct", correct)
                .encode()
                .toUriString();
        return rest.postForObject(url, null, Boolean.class);
    }

    public GameSession action(GameActionRequest request, String authorization) {
        Long levelId = request.getLevelId();
        if (levelId == null || levelId < 1 || levelId > LEVEL_MAX_SCORE.length) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid level");
        }
        GameSession session = activeSessionFor(request.getSessionId(), request.getUserId(), authorization);

        Map<?, ?> evaluation = rest.postForObject(answerUrl + "/answer/evaluate", request, Map.class);
        boolean correct = Boolean.TRUE.equals(evaluation == null ? false : evaluation.get("correct"));

        int scoreDelta = correct ? cappedScore(session, levelId, request.getScoreDelta()) : 0;
        session.setTotalScore(session.getTotalScore() + scoreDelta);
        session.setStreak(correct ? session.getStreak() + 1 : 0);
        if (!correct && !request.isShielded()) {
            loseLifeline(session);
        }
        addLevelScore(session, levelId, scoreDelta);
        if (request.isLevelComplete()) {
            session.setCurrentLevel(Math.min(5, levelId.intValue() + 1));
            if (levelId >= 5 && !"FAILED".equals(session.getStatus())) {
                session.setStatus("COMPLETED");
            }
        }
        GameSession saved = repository.save(session);

        String rank = recordScore(request, levelId, scoreDelta, saved);
        syncUserProfile(saved.getUserId(), saved.getTotalScore(), rank, correct);
        return saved;
    }

    public GameSession useLifeline(Long sessionId, Long userId, String authorization) {
        GameSession session = activeSessionFor(sessionId, userId, authorization);
        loseLifeline(session);
        return repository.save(session);
    }

    /** Loads a session, checking the caller owns it and that it is still in progress. */
    private GameSession activeSessionFor(Long sessionId, Long userId, String authorization) {
        if (sessionId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing session");
        }
        Long callerId = requireCaller(userId, authorization);
        GameSession session = repository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
        if (!callerId.equals(session.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Session belongs to another user");
        }
        if (!"ACTIVE".equals(session.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Game session is " + session.getStatus());
        }
        return session;
    }

    /**
     * Resolves the bearer token with user-service and checks it belongs to {@code userId}
     * (when given). Returns the caller's user id.
     */
    private Long requireCaller(Long userId, String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing session token");
        }
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, authorization);
        Map<?, ?> profile;
        try {
            profile = rest.exchange(userUrl + "/users/me", HttpMethod.GET, new HttpEntity<>(headers), Map.class).getBody();
        } catch (HttpClientErrorException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session token");
        }
        Object id = profile == null ? null : profile.get("id");
        if (!(id instanceof Number)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session token");
        }
        Long callerId = ((Number) id).longValue();
        if (userId != null && !userId.equals(callerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Token does not match user");
        }
        return callerId;
    }

    /** Clamps the client-reported points so a level can never exceed its maximum. */
    private int cappedScore(GameSession session, Long levelId, int requested) {
        int index = levelId.intValue() - 1;
        int alreadyEarned = session.getLevelScores() != null && session.getLevelScores().size() > index
                ? session.getLevelScores().get(index) : 0;
        int remaining = Math.max(0, LEVEL_MAX_SCORE[index] - alreadyEarned);
        return Math.max(0, Math.min(requested, remaining));
    }

    /** Records the action with score-service and returns the rank it computed (null if unavailable). */
    private String recordScore(GameActionRequest request, Long levelId, int scoreDelta, GameSession saved) {
        try {
            Map<?, ?> score = rest.postForObject(scoreUrl + "/score/update", new HttpEntity<>(Map.of(
                    "userId", saved.getUserId(),
                    "playerName", request.getPlayerName() == null ? "Operator" : request.getPlayerName(),
                    "levelId", levelId,
                    "score", scoreDelta,
                    "totalScore", saved.getTotalScore(),
                    "streak", saved.getStreak()), internalHeaders()), Map.class);
            Object rank = score == null ? null : score.get("rankName");
            return rank == null ? null : rank.toString();
        } catch (Exception ex) {
            System.err.println("Warning: failed to record score for user " + saved.getUserId() + ": " + ex.getMessage());
            return null;
        }
    }

    private void syncUserProfile(Long userId, int totalScore, String rank, boolean correct) {
        if (userId == null) {
            return;
        }
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("score", totalScore);
        body.put("rank", rank);
        body.put("correctDecision", correct);
        try {
            rest.exchange(userUrl + "/users/" + userId + "/progress", HttpMethod.PUT,
                    new HttpEntity<>(body, internalHeaders()), Object.class);
        } catch (Exception ex) {
            System.err.println("Warning: failed to sync user profile progress for user " + userId + ": " + ex.getMessage());
        }
    }

    private HttpHeaders internalHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(INTERNAL_KEY_HEADER, internalApiKey);
        return headers;
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
