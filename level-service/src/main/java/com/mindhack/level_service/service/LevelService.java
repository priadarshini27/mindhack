package com.mindhack.level_service.service;
import com.mindhack.level_service.model.Level;
import com.mindhack.level_service.repository.LevelRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LevelService {
    private final LevelRepository repo;
    public LevelService(LevelRepository repo) {
        this.repo = repo;
    }
    public Level getLevel(Long id) {
        return repo.findById(id).orElseGet(() -> defaultLevels().stream()
                .filter(level -> level.getId().equals(id))
                .findFirst()
                .orElseThrow());
    }
    public List<Level> getLevels() {
        List<Level> stored = repo.findAll();
        return stored.isEmpty() ? defaultLevels() : stored;
    }
    public Level saveLevel(Level level) {
        return repo.save(level);
    }

    private List<Level> defaultLevels() {
        return List.of(
                level(1L, "Suspicious Inbox", "EMAIL_TRIAGE", "Review a realistic inbox and classify safe vs phishing messages.", 150, 0),
                level(2L, "Chat Trap", "CHAT_SIMULATION", "Handle a WhatsApp-style social engineering attempt with live typing pressure.", 120, 0),
                level(3L, "Time Bomb Link", "TIMED_DECISION", "Decide whether to click, ignore, or report before the 30-second attack window expires.", 120, 30),
                level(4L, "Spot the Breach", "WEBSITE_AUDIT", "Inspect a fake banking portal and click every suspicious breach indicator.", 160, 0),
                level(5L, "Escape Protocol", "COMBINED_ESCAPE", "Survive a combined phishing, spoofing, urgency, and credential theft scenario.", 200, 45));
    }

    private Level level(Long id, String title, String type, String brief, int score, int seconds) {
        Level level = new Level();
        level.setId(id);
        level.setTitle(title);
        level.setSimulationType(type);
        level.setMissionBrief(brief);
        level.setMaxScore(score);
        level.setTimeLimitSeconds(seconds);
        return level;
    }
}
