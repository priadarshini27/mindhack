package com.mindhack.user_service.repository;

import com.mindhack.user_service.model.UserProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);
    Optional<UserProfile> findBySessionToken(String sessionToken);
}
