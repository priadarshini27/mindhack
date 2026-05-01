package com.mindhack.user_service.controller;

import com.mindhack.user_service.dto.AuthRequest;
import com.mindhack.user_service.dto.AuthResponse;
import com.mindhack.user_service.dto.OathRequest;
import com.mindhack.user_service.dto.ProfileUpdateRequest;
import com.mindhack.user_service.model.UserProfile;
import com.mindhack.user_service.service.UserService;
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

    public UserController(UserService service) {
        this.service = service;
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
    public UserProfile oath(@PathVariable Long userId, @RequestBody OathRequest request) {
        return service.completeOath(userId, request.getPledges() == null ? 0 : request.getPledges().size());
    }

    @PutMapping("/{userId}/progress")
    public UserProfile progress(@PathVariable Long userId, @RequestBody ProfileUpdateRequest request) {
        return service.updateProgress(userId, request);
    }
}
