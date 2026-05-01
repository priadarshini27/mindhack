package com.mindhack.feedback_service.dto;

import java.util.List;

public class AnalysisRequest {
    private Long userId;
    private List<ActionTrace> actions;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public List<ActionTrace> getActions() { return actions; }
    public void setActions(List<ActionTrace> actions) { this.actions = actions; }
}
