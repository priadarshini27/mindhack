package com.mindhack.scenario_service.model;
import jakarta.persistence.*;

@Entity
public class Scenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long levelId;
    private String type;
    @Column(length = 8000)
    private String content;
    @Column(length = 2000)
    private String correctSignals;

    // Getter and Setter for id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLevelId() {
        return levelId;
    }

    public void setLevelId(Long levelId) {
        this.levelId = levelId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getCorrectSignals() {
        return correctSignals;
    }
    public void setCorrectSignals(String correctSignals) {
        this.correctSignals = correctSignals;
    }
}
