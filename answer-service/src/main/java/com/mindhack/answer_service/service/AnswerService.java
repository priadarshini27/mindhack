package com.mindhack.answer_service.service;

import com.mindhack.answer_service.dto.AnswerRequest;
import com.mindhack.answer_service.dto.AnswerResponse;
import com.mindhack.answer_service.model.AnswerAttempt;
import com.mindhack.answer_service.repository.AnswerAttemptRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnswerService {
    private final AnswerAttemptRepository repository;

    public AnswerService(AnswerAttemptRepository repository) {
        this.repository = repository;
    }

    public boolean checkAnswer(String answer, String correct) {
        return answer.equalsIgnoreCase(correct);
    }

    public AnswerResponse evaluate(AnswerRequest request) {
        boolean correct = checkAnswer(request.getAction(), request.getExpectedAction());
        AnswerAttempt attempt = new AnswerAttempt();
        attempt.setUserId(request.getUserId());
        attempt.setLevelId(request.getLevelId());
        attempt.setAction(request.getAction());
        attempt.setExpectedAction(request.getExpectedAction());
        attempt.setCorrect(correct);
        attempt.setWeaknessCategory(correct ? "none" : request.getWeaknessCategory());
        attempt.setDecisionTimeMs(request.getDecisionTimeMs());
        repository.save(attempt);
        String message = correct ? "Defensive decision confirmed." : "Risky action detected. Review the signal category.";
        return new AnswerResponse(correct, message, attempt.getWeaknessCategory());
    }

    public List<AnswerAttempt> attempts(Long userId) {
        return repository.findByUserId(userId);
    }

    public boolean isScam(String message) {
        return message.toLowerCase().contains("otp") ||
               message.toLowerCase().contains("urgent") ||
               message.toLowerCase().contains("click");
    }
}
