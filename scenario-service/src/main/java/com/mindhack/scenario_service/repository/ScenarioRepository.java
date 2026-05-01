package com.mindhack.scenario_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mindhack.scenario_service.model.Scenario;

public interface ScenarioRepository extends JpaRepository<Scenario, Long> {
    Scenario findByLevelId(Long levelId);
}