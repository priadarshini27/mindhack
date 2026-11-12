package com.mindhack.user_service.controller;

import com.mindhack.user_service.dto.AuthRequest;
import com.mindhack.user_service.dto.AuthResponse;
import com.mindhack.user_service.dto.OathRequest;
import com.mindhack.user_service.dto.ProfileUpdateRequest;
import com.mindhack.user_service.exception.AuthException;
import com.mindhack.user_service.model.UserProfile;
import com.mindhack.user_service.service.UserService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService service;
    private final String internalApiKey;

    public UserController(UserService service, @Value("${internal.api-key}") String internalApiKey) {
        this.service = service;
        this.internalApiKey = internalApiKey;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody AuthRequest request) {
        return service.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return service.login(request);
    }

    @GetMapping("/me")
    public UserProfile me(@RequestHeader("Authorization") String token) {
        return service.profile(token.replace("Bearer ", ""));
    }

    @PostMapping("/{userId}/oath")
    public UserProfile oath(
            @PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody OathRequest request) {
        return service.completeOath(userId, bearer(authorization),
                request.getPledges() == null ? 0 : request.getPledges().size());
    }

    /** Called by game-service only; protected by the shared internal API key. */
    @PutMapping("/{userId}/progress")
    public UserProfile progress(
            @PathVariable Long userId,
            @RequestHeader(value = "X-Internal-Key", required = false) String key,
            @RequestBody ProfileUpdateRequest request) {
        if (key == null || !MessageDigest.isEqual(
                key.getBytes(StandardCharsets.UTF_8), internalApiKey.getBytes(StandardCharsets.UTF_8))) {
            throw new AuthException("Internal endpoint");
        }
        return service.updateProgress(userId, request);
    }

    private static String bearer(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new AuthException("Missing session token");
        }
        return authorization.substring("Bearer ".length());
    }
}
