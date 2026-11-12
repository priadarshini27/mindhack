import React, { useState, useEffect, useRef } from 'react';
import { FaShieldAlt, FaTerminal, FaServer, FaInbox, FaCommentDots } from 'react-icons/fa';

const Level5Escape = ({ onAction }) => {
  const [phase, setPhase] = useState(0); 
  const [feedback, setFeedback] = useState(null);
  
  const [logs, setLogs] = useState([]);
  const [terminalTyping, setTerminalTyping] = useState(false);

  useEffect(() => {
    if (phase === 2 && logs.length === 0) {
      setTerminalTyping(true);
      const script = [
        "[SYSTEM] Alert: Privilege escalation detected on DB_SERVER_01",
        "[SYSTEM] Multiple failed SSH attempts from internal network",
        "[SYSTEM] Unauthorized access to /etc/shadow",
        "[WARNING] Massive data egress detected on Port 443..."
      ];
      
      script.forEach((log, idx) => {
        setTimeout(() => {
          setLogs(prev => [...prev, log]);
          if (idx === script.length - 1) setTerminalTyping(false);
        }, (idx + 1) * 1500);
      });
    }
  }, [phase, logs.length]);

  const handleEmailAction = (markPhishing) => {
    if (feedback) return;
    if (!markPhishing) {
      setFeedback({ correct: false, message: "Incorrect. You trusted a suspicious vendor update. The attacker gained a foothold!" });
      setTimeout(() => onAction(false, 0, false), 2500);
    } else {
      setFeedback({ correct: true, message: "Good catch. But the attacker immediately pivots to another vector..." });
      setTimeout(() => {
        setFeedback(null);
        setPhase(1);
      }, 2500);
    }
  };

  const handleChatAction = (block) => {
    if (feedback) return;
    if (!block) {
      setFeedback({ correct: false, message: "Incorrect. You engaged with the attacker and they cloned your session." });
      setTimeout(() => onAction(false, 0, false), 2500);
    } else {
      setFeedback({ correct: true, message: "Blocked! But wait, alarms are going off in the server room!" });
      setTimeout(() => {
        setFeedback(null);
        setPhase(2);
      }, 2500);
    }
  };

  const handleTerminalAction = (action) => {
    if (feedback || terminalTyping) return;
    if (action === 'shutdown') {
      setFeedback({ correct: false, message: "Critical Failure! You shut down the main server, causing a massive outage and losing trace of the attacker." });
      setTimeout(() => onAction(false, 0, false), 2500);
    } else if (action === 'isolate') {
      setFeedback({ correct: true, message: "Excellent! You isolated the compromised node, stopping the breach without causing a total outage." });
      setTimeout(() => onAction(true, 500, true), 3000);
    } else if (action === 'ignore') {
      setFeedback({ correct: false, message: "You ignored the logs. The attacker successfully exfiltrated 500GB of customer data." });
      setTimeout(() => onAction(false, 0, false), 2500);
    }
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
        <FaShieldAlt /> Level 5: Escape Protocol
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        {phase === 0 && "Phase 1: A highly targeted spear-phishing email just arrived."}
        {phase === 1 && "Phase 2: The attacker is trying to bypass MFA via SMS."}
        {phase === 2 && "Phase 3: They breached the perimeter. Stop the exfiltration!"}
      </p>

      {/* Phase 0: Email */}
      {phase === 0 && (
        <div style={styles.contentArea}>
          <div style={styles.emailPreview}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <FaInbox /> Subject: URGENT: AWS Infrastructure Update Required
            </h3>
            <p><strong>From:</strong> IT Support &lt;it-admin@mindhack-corp.co&gt;</p>
            <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
              We have detected a critical vulnerability in your deployed EC2 instances. 
              Please download the attached patch tool and run it as Administrator immediately to secure your environment.
            </p>
          </div>
          {!feedback && (
            <div style={styles.actions}>
              <button className="btn" onClick={() => handleEmailAction(false)}>Download & Run</button>
              <button className="btn btn-danger" onClick={() => handleEmailAction(true)}>Report Phishing</button>
            </div>
          )}
        </div>
      )}

      {/* Phase 1: Chat */}
      {phase === 1 && (
        <div style={styles.contentArea}>
          <div style={styles.chatBox}>
            <div style={styles.msgLeft}>
              MINDHACK-IT: Your password reset request has been approved. If this wasn't you, reply with your current password to cancel.
            </div>
          </div>
          {!feedback && (
            <div style={styles.actions}>
              <button className="btn btn-danger" onClick={() => handleChatAction(false)}>Reply Password</button>
              <button className="btn" onClick={() => handleChatAction(true)}>Block Sender</button>
            </div>
          )}
        </div>
      )}

      {/* Phase 2: Terminal */}
      {phase === 2 && (
        <div style={styles.contentArea}>
          <div style={styles.terminal}>
            <div style={styles.terminalHeader}>
              <FaTerminal /> root@mindhack-sec-ops:~
            </div>
            <div style={styles.terminalBody}>
              {logs.map((log, index) => (
                <div key={index} style={{ color: log.includes('WARNING') ? 'var(--danger)' : '#a8ccfa', marginBottom: '0.5rem' }}>
                  {log}
                </div>
              ))}
              {terminalTyping && (
                <div style={{ color: 'var(--accent-color)' }} className="pulse-glow">
                  Analyzing network traffic...
                </div>
              )}
              {!terminalTyping && (
                <div style={{ color: 'var(--success)', marginTop: '1rem' }} className="pulse-glow">
                  _ Awaiting Incident Response Command...
                </div>
              )}
            </div>
          </div>
          {!feedback && !terminalTyping && (
            <div style={styles.actionPanel}>
              <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}><FaServer /> Response Options</h3>
              <div style={styles.actions}>
                <button className="btn btn-danger" onClick={() => handleTerminalAction('shutdown')}>
                  INITIATE TOTAL SHUTDOWN
                </button>
                <button className="btn btn-primary" onClick={() => handleTerminalAction('isolate')}>
                  ISOLATE COMPROMISED NODE
                </button>
                <button className="btn" onClick={() => handleTerminalAction('ignore')}>
                  CONTINUE MONITORING
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {feedback && (
        <div style={{ ...styles.feedback, ...(feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong) }}>
          {feedback.message}
          {feedback.correct && phase === 2 && <div style={{ marginTop: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>Level Complete!</div>}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
  },
  emailPreview: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  chatBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '1.5rem',
  },
  msgLeft: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '1rem',
    borderRadius: '12px 12px 12px 0',
    maxWidth: '80%',
    lineHeight: '1.4',
  },
  terminal: {
    backgroundColor: '#050a14',
    borderRadius: '8px',
    border: '1px solid var(--accent-glow)',
    overflow: 'hidden',
    flex: 1,
    minHeight: '200px',
  },
  terminalHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    borderBottom: '1px solid var(--accent-glow)',
  },
  terminalBody: {
    padding: '1.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.95rem',
  },
  actionPanel: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  feedback: {
    padding: '1.5rem',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  feedbackCorrect: {
    color: 'var(--success)',
    borderColor: 'var(--success)',
    backgroundColor: 'rgba(41, 204, 144, 0.12)',
  },
  feedbackWrong: {
    color: 'var(--danger)',
    borderColor: 'var(--danger)',
    backgroundColor: 'rgba(255, 82, 82, 0.12)',
  }
};

export default Level5Escape;
