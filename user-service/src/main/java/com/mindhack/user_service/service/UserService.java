package com.mindhack.user_service.service;

import com.mindhack.user_service.dto.AuthRequest;
import com.mindhack.user_service.dto.AuthResponse;
import com.mindhack.user_service.dto.ProfileUpdateRequest;
import com.mindhack.user_service.exception.ApiException;
import com.mindhack.user_service.exception.AuthException;
import com.mindhack.user_service.model.UserProfile;
import com.mindhack.user_service.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public AuthResponse signup(AuthRequest request) {
        validatePassword(request.getPassword());
        repository.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new ApiException("Email already registered");
        });
        UserProfile user = new UserProfile();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(PasswordHasher.hash(request.getPassword()));
        user.setSessionToken(UUID.randomUUID().toString());
        user.setLastLoginDate(LocalDate.now());
        user.getRankHistory().add("Beginner");
        log.info("Created user profile for {}", request.getEmail());
        return new AuthResponse(user.getSessionToken(), repository.save(user));
    }

    public AuthResponse login(AuthRequest request) {
        UserProfile user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password"));
        String password = request.getPassword() == null ? "" : request.getPassword();
        String stored = user.getPasswordHash();
        if (PasswordHasher.isHashed(stored)) {
            if (!PasswordHasher.matches(password, stored)) {
                throw new ApiException("Invalid email or password");
            }
        } else {
            // Accounts created before PBKDF2 was introduced store an unsalted SHA-256 hex digest.
            // Verify it once, then upgrade the stored hash.
            if (stored == null || !MessageDigest.isEqual(
                    stored.getBytes(StandardCharsets.UTF_8),
                    legacySha256(password).getBytes(StandardCharsets.UTF_8))) {
                throw new ApiException("Invalid email or password");
            }
            user.setPasswordHash(PasswordHasher.hash(password));
        }
        user.setSessionToken(UUID.randomUUID().toString());
        updateDailyStreak(user);
        return new AuthResponse(user.getSessionToken(), repository.save(user));
    }

    public UserProfile profile(String token) {
        return repository.findBySessionToken(token).orElseThrow(() -> new AuthException("Invalid session"));
    }

    public UserProfile completeOath(Long userId, String token, int pledgeCount) {
        requireOwner(userId, token);
        if (pledgeCount < 5) {
            throw new ApiException("All cybersecurity pledges must be selected");
        }
        UserProfile user = repository.findById(userId).orElseThrow(() -> new ApiException("User not found"));
        user.setOathCompleted(true);
        return repository.save(user);
    }

    public UserProfile updateProgress(Long userId, ProfileUpdateRequest request) {
        UserProfile user = repository.findById(userId).orElseThrow(() -> new ApiException("User not found"));
        if (request.getScore() > user.getBestScore()) {
            user.setBestScore(request.getScore());
        }
        if (request.getRank() != null && !request.getRank().isBlank() && !request.getRank().equals(user.getLatestRank())) {
            user.setLatestRank(request.getRank());
            user.getRankHistory().add(request.getRank());
        }
        if (request.isCorrectDecision()) {
            user.setConsecutiveCorrect(user.getConsecutiveCorrect() + 1);
            user.setBestStreak(Math.max(user.getBestStreak(), user.getConsecutiveCorrect()));
        } else {
            user.setConsecutiveCorrect(0);
        }
        return repository.save(user);
    }

    private void requireOwner(Long userId, String token) {
        UserProfile caller = profile(token);
        if (!caller.getId().equals(userId)) {
            throw new AuthException("Not allowed to modify another user");
        }
    }

    /** Daily login streak. Kept separate from bestStreak, which counts consecutive correct decisions. */
    private void updateDailyStreak(UserProfile user) {
        LocalDate today = LocalDate.now();
        if (today.equals(user.getLastLoginDate())) {
            return;
        }
        if (user.getLastLoginDate() != null && today.minusDays(1).equals(user.getLastLoginDate())) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        } else {
            user.setCurrentStreak(1);
        }
        user.setBestLoginStreak(Math.max(user.getBestLoginStreak(), user.getCurrentStreak()));
        user.setLastLoginDate(today);
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new ApiException("Password must be at least 6 characters");
        }
    }

    private static String legacySha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new ApiException("Unable to verify password");
        }
    }
}
