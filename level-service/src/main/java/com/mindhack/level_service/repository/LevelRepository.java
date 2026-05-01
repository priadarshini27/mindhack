package com.mindhack.level_service.repository;

import com.mindhack.level_service.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LevelRepository extends JpaRepository<Level, Long> {
}