import React, { useState, useEffect } from 'react';
import { FaBomb, FaMousePointer, FaBan } from 'react-icons/fa';

const Level3Bomb = ({ onAction }) => {
  const [timeLeft, setTimeLeft] = useState(40);
  const [feedback, setFeedback] = useState(null);
  const [active, setActive] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!active || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, active]);

  useEffect(() => {
    if (timeLeft === 0 && active) {
      setActive(false);
      setFeedback({ correct: false, message: "Time's up! You waited too long and the malicious link executed." });
      onAction(false, 0, false);
    }
  }, [timeLeft, active, onAction]);

  const handleDecision = (action) => {
    if (!active) return;

    if (stage === 0) {
      if (action === 'inspect') {
        setStage(1);
      } else if (action === 'click') {
        setActive(false);
        setFeedback({ correct: false, message: "Fatal error! You clicked the malicious update link immediately." });
        onAction(false, 0, false);
      } else if (action === 'ignore') {
        setStage(2);
      }
    } else if (stage === 1) {
      if (action === 'report') {
        setActive(false);
        setFeedback({ correct: true, message: "Perfect! You identified the link as malicious and reported it before clicking." });
        setTimeout(() => onAction(true, 250 + timeLeft * 2, true), 2500);
      } else if (action === 'click') {
        setActive(false);
        setFeedback({ correct: false, message: "The malicious link was embedded in the update prompt. Clicking it triggered the attack." });
        onAction(false, 0, false);
      } else if (action === 'dismiss') {
        setStage(2);
      }
    } else if (stage === 2) {
      if (action === 'report') {
        setActive(false);
        setFeedback({ correct: true, message: "Great instincts. Reporting it now helped contain the threat." });
        setTimeout(() => onAction(true, 200 + timeLeft * 2, true), 2500);
      } else {
        setActive(false);
        setFeedback({ correct: false, message: "You hesitated too long and the attack succeeded." });
        onAction(false, 0, false);
      }
    }
  };

  const renderStageContent = () => {
    if (stage === 0) {
      return (
        <>
          <div style={styles.alertText}>
            A high-priority security alert has appeared on your dashboard.
            It looks urgent and pushes you to click a verification link.
          </div>
          <div style={styles.linkBlock}>
            <div style={styles.fakeLink}>http://auth-mindhack-secure-update.com/verify?token=123981293</div>
            <div style={styles.fakeLink}>http://mindhack-support-secure.com/validate</div>
          </div>
          <div style={styles.actions}>
            <button className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDecision('inspect')}>
              Inspect the Link
            </button>
            <button className="btn" onClick={() => handleDecision('ignore')}>
              Ignore the Alert
            </button>
            <button className="btn btn-danger" onClick={() => handleDecision('click')}>
              <FaMousePointer /> Click Immediately
            </button>
          </div>
        </>
      );
    }

    if (stage === 1) {
      return (
        <>
          <div style={styles.alertText}>
            The link domain is suspicious and the update prompt is overly aggressive.
            You now have the chance to act on it safely.
          </div>
          <div style={styles.warningBox}>
            <strong>Suspicious details:</strong>
            <ul>
              <li>Domain uses a typo and extra keywords.</li>
              <li>HTTPS is missing / invalid.</li>
              <li>The message demands immediate action.</li>
            </ul>
          </div>
          <div style={styles.actions}>
            <button className="btn btn-primary" onClick={() => handleDecision('report')}>
              <FaBan /> Report & Isolate
            </button>
            <button className="btn" onClick={() => handleDecision('dismiss')}>
              Dismiss Warning and Wait
            </button>
            <button className="btn btn-danger" onClick={() => handleDecision('click')}>
              <FaMousePointer /> Click Anyway
            </button>
          </div>
        </>
      );
    }

    if (stage === 2) {
      return (
        <>
          <div style={styles.alertText}>
            The alert is still active and the attacker is pushing harder.
            You can either report it now or let the attack continue.
          </div>
          <div style={styles.actions}>
            <button className="btn btn-primary" onClick={() => handleDecision('report')}>
              Report & Isolate Now
            </button>
            <button className="btn btn-danger" onClick={() => handleDecision('wait')}>
              Wait and Do Nothing
            </button>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
        <FaBomb className="pulse-glow" /> Level 3: Time Bomb Link
      </h2>

      <div style={styles.alertBox}>
        <h3 style={{ color: 'var(--danger)', margin: 0 }}>CRITICAL SECURITY UPDATE</h3>
        <p>This alert is designed to make you panic and click without checking the details.</p>
        <div style={styles.timer}>
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>

        {renderStageContent()}
      </div>

      {feedback && (
      <div
        style={{
          ...styles.feedback,
          ...(feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong),
        }}
        >
        {feedback.message}
        {feedback.correct && <div style={{ marginTop: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>Level Complete!</div>}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBox: {
    backgroundColor: '#1a0b0b',
    border: '2px solid var(--danger)',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 0 30px rgba(255, 77, 79, 0.2)',
  },
  timer: {
    fontSize: '4rem',
    fontWeight: 'bold',
    fontFamily: 'var(--font-mono)',
    color: 'var(--danger)',
    margin: '1.5rem 0',
  },
  alertText: {
    marginTop: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    textAlign: 'left',
  },
  linkBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    textAlign: 'left',
  },
  fakeLink: {
    padding: '1rem',
    backgroundColor: 'var(--bg-color)',
    color: '#3498db',
    textDecoration: 'underline',
    wordBreak: 'break-all',
    fontFamily: 'var(--font-mono)',
    border: '1px solid #333',
  },
  warningBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
    textAlign: 'left',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  feedback: {
  padding: '1rem',
  textAlign: 'center',
  fontWeight: 'bold',
  marginTop: '2rem',
  fontSize: '1.2rem',
  borderRadius: '10px',
  border: '1px solid',
},

feedbackCorrect: {
  color: 'green',
  borderColor: 'green',
},

feedbackWrong: {
  color: 'red',
  borderColor: 'red',
},
};

export default Level3Bomb;
