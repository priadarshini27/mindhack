package com.mindhack.user_service.dto;

import com.mindhack.user_service.model.UserProfile;

public class AuthResponse {
    private String token;
    private UserProfile user;

    public AuthResponse(String token, UserProfile user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public UserProfile getUser() { return user; }
}
