import React, { useState, useEffect } from 'react';
import { FaBomb, FaMousePointer, FaBan } from 'react-icons/fa';

const Level3Bomb = ({ onAction }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [active, setActive] = useState(true);

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
      setFeedback({ correct: false, message: "Time's up! You panicked and failed to report the threat." });
      onAction(false, 0);
    }
  }, [timeLeft, active, onAction]);

  const handleDecision = (action) => {
    if (!active) return;
    setActive(false);

    if (action === 'click') {
      setFeedback({ correct: false, message: "Fatal error! You clicked a high-pressure malicious link." });
      onAction(false, 0);
    } else if (action === 'ignore') {
      setFeedback({ correct: false, message: "Ignoring it wasn't enough. The malware infected the network anyway." });
      onAction(false, 0);
    } else if (action === 'report') {
      setFeedback({ correct: true, message: "Perfect! You kept your cool and reported the threat to IT." });
      onAction(true, 200 + timeLeft * 2); // Bonus points for speed
    }
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
        <FaBomb className="pulse-glow" /> Level 3: Time Bomb Link
      </h2>

      <div style={styles.alertBox}>
        <h3 style={{ color: 'var(--danger)', margin: 0 }}>CRITICAL SECURITY UPDATE</h3>
        <p>Your cloud instance has been compromised. All data will be wiped in 30 seconds unless you authenticate immediately.</p>
        
        <div style={styles.timer}>
          00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </div>

        <div style={styles.fakeLink}>
          http://auth-mindhack-secure-update.com/verify?token=123981293
        </div>
      </div>

      {feedback ? (
        <div style={{...styles.feedback, color: feedback.correct ? 'var(--success)' : 'var(--danger)'}}>
          {feedback.message}
        </div>
      ) : (
        <div style={styles.actions}>
          <button className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDecision('click')}>
            <FaMousePointer /> Click to Authenticate
          </button>
          <button className="btn" onClick={() => handleDecision('ignore')}>
            Ignore Message
          </button>
          <button className="btn btn-primary" onClick={() => handleDecision('report')}>
            <FaBan /> Report & Isolate
          </button>
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
  fakeLink: {
    padding: '1rem',
    backgroundColor: 'var(--bg-color)',
    color: '#3498db',
    textDecoration: 'underline',
    wordBreak: 'break-all',
    fontFamily: 'var(--font-mono)',
    border: '1px solid #333',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  feedback: {
    padding: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: '2rem',
    fontSize: '1.2rem'
  }
};

export default Level3Bomb;
