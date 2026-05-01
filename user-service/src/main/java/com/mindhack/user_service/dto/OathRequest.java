package com.mindhack.user_service.dto;

import java.util.List;

public class OathRequest {
    private List<String> pledges;

    public List<String> getPledges() { return pledges; }
    public void setPledges(List<String> pledges) { this.pledges = pledges; }
}
