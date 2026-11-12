package com.mindhack.user_service.exception;

/** Missing, invalid or insufficient credentials. Mapped to HTTP 401. */
public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }
}
