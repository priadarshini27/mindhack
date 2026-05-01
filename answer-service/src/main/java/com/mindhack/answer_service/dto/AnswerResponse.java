package com.mindhack.answer_service.dto;

public record AnswerResponse(boolean correct, String feedback, String weaknessCategory) {
}
