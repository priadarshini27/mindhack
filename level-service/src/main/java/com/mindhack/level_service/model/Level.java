package com.mindhack.level_service.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String simulationType;
    private String missionBrief;
    private int maxScore;
    private int timeLimitSeconds;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSimulationType() { return simulationType; }
    public void setSimulationType(String simulationType) { this.simulationType = simulationType; }
    public String getMissionBrief() { return missionBrief; }
    public void setMissionBrief(String missionBrief) { this.missionBrief = missionBrief; }
    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { this.maxScore = maxScore; }
    public int getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(int timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; }
}
