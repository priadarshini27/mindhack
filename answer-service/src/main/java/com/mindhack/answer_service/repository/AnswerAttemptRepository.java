package com.mindhack.answer_service.repository;

import com.mindhack.answer_service.model.AnswerAttempt;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerAttemptRepository extends JpaRepository<AnswerAttempt, Long> {
    List<AnswerAttempt> findByUserId(Long userId);
}
