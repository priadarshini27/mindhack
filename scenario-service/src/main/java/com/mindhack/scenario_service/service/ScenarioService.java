package com.mindhack.scenario_service.service;

import org.springframework.stereotype.Service;
import com.mindhack.scenario_service.repository.ScenarioRepository;
import com.mindhack.scenario_service.model.Scenario;
import java.util.List;

@Service
public class ScenarioService {

    private final ScenarioRepository repo;

    public ScenarioService(ScenarioRepository repo) {
        this.repo = repo;
    }

    public Scenario getScenario(Long levelId) {
        Scenario stored = repo.findByLevelId(levelId);
        return stored == null ? defaults().stream().filter(item -> item.getLevelId().equals(levelId)).findFirst().orElseThrow() : stored;
    }

    public List<Scenario> getAll() {
        List<Scenario> stored = repo.findAll();
        return stored.isEmpty() ? defaults() : stored;
    }

    public Scenario save(Scenario scenario) {
        return repo.save(scenario);
    }

    private List<Scenario> defaults() {
        return List.of(
                scenario(1L, "EMAIL_TRIAGE",
                        "[{\"sender\":\"security@paypaI-alert.com\",\"subject\":\"Account locked: verify password now\",\"risk\":\"PHISHING\"},{\"sender\":\"it-helpdesk@company.com\",\"subject\":\"VPN maintenance notice\",\"risk\":\"SAFE\"},{\"sender\":\"rewards@bank-secure-login.net\",\"subject\":\"Claim refund within 10 minutes\",\"risk\":\"PHISHING\"},{\"sender\":\"hr@company.com\",\"subject\":\"Policy acknowledgement reminder\",\"risk\":\"SAFE\"},{\"sender\":\"no-reply@cloud-drive-share.ru\",\"subject\":\"Shared file: payroll.xlsm\",\"risk\":\"PHISHING\"},{\"sender\":\"alerts@github.com\",\"subject\":\"New sign-in from Chrome on Windows\",\"risk\":\"SAFE\"},{\"sender\":\"ceo.office@cornpany.com\",\"subject\":\"Urgent wire transfer approval\",\"risk\":\"PHISHING\"},{\"sender\":\"newsletter@cyber.gov\",\"subject\":\"Awareness bulletin\",\"risk\":\"SAFE\"},{\"sender\":\"support@microsoft-365-reset.co\",\"subject\":\"Mailbox quota exceeded\",\"risk\":\"PHISHING\"},{\"sender\":\"training@company.com\",\"subject\":\"Security drill results\",\"risk\":\"SAFE\"}]",
                        "lookalike domains, urgent language, credential requests, risky attachments"),
                scenario(2L, "CHAT_SIMULATION",
                        "[{\"from\":\"scammer\",\"text\":\"Hi, this is payroll support. Your salary account is blocked.\",\"delay\":900},{\"from\":\"scammer\",\"text\":\"Share the OTP we just sent so I can restore it before cutoff.\",\"delay\":1800},{\"from\":\"playerOptions\",\"text\":\"refuse_otp,verify_official_channel,share_otp\"}]",
                        "never share OTP, verify through official channel, resist urgency"),
                scenario(3L, "TIMED_DECISION",
                        "{\"message\":\"Your cloud photos will be deleted in 30 seconds. Click http://secure-backup-login.verify-now.co\",\"actions\":[\"CLICK\",\"IGNORE\",\"REPORT\"],\"correct\":\"REPORT\",\"seconds\":30}",
                        "report suspicious link before timeout"),
                scenario(4L, "WEBSITE_AUDIT",
                        "{\"brand\":\"NorthBank Secure\",\"url\":\"http://northbank-login.secure-pay.co\",\"hotspots\":[\"fake-url\",\"broken-https\",\"password-reset-form\",\"misspelled-footer\"],\"safeAreas\":[\"logo\",\"support-copy\"]}",
                        "fake URL, broken HTTPS, malicious credential form"),
                scenario(5L, "COMBINED_ESCAPE",
                        "{\"steps\":[\"classify spoofed executive email\",\"refuse OTP in chat\",\"report time-bomb link\",\"flag fake banking portal\"],\"winCondition\":\"complete three or more defensive actions\"}",
                        "multi-step pattern recognition and calm verification"));
    }

    private Scenario scenario(Long levelId, String type, String content, String signals) {
        Scenario scenario = new Scenario();
        scenario.setLevelId(levelId);
        scenario.setType(type);
        scenario.setContent(content);
        scenario.setCorrectSignals(signals);
        return scenario;
    }
}
