package com.mindhack.feedback_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.mindhack.feedback_service.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByLevelIdAndType(Long levelId, String type);
}