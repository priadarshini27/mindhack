package com.mindhack.feedback_service;

import com.mindhack.feedback_service.dto.ActionTrace;
import com.mindhack.feedback_service.dto.AnalysisRequest;
import com.mindhack.feedback_service.dto.AnalysisResponse;
import com.mindhack.feedback_service.service.FeedbackService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class FeedbackServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void analyzeReturnsNewContractFields() {
		FeedbackService service = new FeedbackService(null);

		ActionTrace action1 = new ActionTrace();
		action1.setLevelId(1L);
		action1.setCorrect(false);
		action1.setWeaknessCategory("Phishing detection");
		action1.setDecisionTimeMs(4200);

		ActionTrace action2 = new ActionTrace();
		action2.setLevelId(2L);
		action2.setCorrect(true);
		action2.setWeaknessCategory("None");
		action2.setDecisionTimeMs(3200);

		AnalysisRequest request = new AnalysisRequest();
		request.setUserId(1L);
		request.setActions(List.of(action1, action2));

		AnalysisResponse response = service.analyze(request);

		assertThat(response.riskScore()).isBetween(0, 100);
		assertThat(response.riskLevel()).isIn("Low", "Moderate", "High");
		assertThat(response.recommendedTraining()).isNotEmpty();
		assertThat(response.weakestCategory()).isNotNull();
		assertThat(response.coachingSummary()).isNotBlank();
	}

}
