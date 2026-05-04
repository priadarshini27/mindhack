import React, { useState } from 'react';
import { FaSearch, FaLockOpen } from 'react-icons/fa';

const Level4Breach = ({ onAction }) => {
  const [found, setFound] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const anomalies = [
    { id: 'url', label: 'Suspicious Domain (pay-pal-secure.com)', points: 100 },
    { id: 'ssl', label: 'Missing HTTPS / Unsecure Connection', points: 100 },
    { id: 'form', label: 'Asking for ATM PIN online', points: 100 },
  ];

  const handleSpot = (id) => {
    if (found.includes(id) || feedback) return;
    
    const newFound = [...found, id];
    setFound(newFound);

    if (newFound.length === 3) {
      setFeedback({ correct: true, message: "Excellent! You spotted all the red flags on this spoofed site." });
      setTimeout(() => onAction(true, 300), 2000);
    }
  };

  const handleMiss = () => {
    if (feedback) return;
    setFeedback({ correct: false, message: "You missed the obvious red flags and entered data!" });
    setTimeout(() => onAction(false, 0, false), 2000);
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaSearch /> Level 4: Spot the Breach
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        This banking portal looks normal, but something is wrong. Click on all 3 suspicious elements before logging in.
      </p>

      <div style={styles.browser}>
        <div style={styles.addressBar}>
          <div 
            style={{...styles.urlElement, borderColor: found.includes('ssl') ? 'var(--success)' : 'transparent'}}
            onClick={() => handleSpot('ssl')}
          >
            <FaLockOpen color="var(--danger)" /> <span style={{ color: 'var(--danger)', textDecoration: 'line-through' }}>https</span>
          </div>
          <div 
            style={{...styles.urlElement, borderColor: found.includes('url') ? 'var(--success)' : 'transparent'}}
            onClick={() => handleSpot('url')}
          >
            pay-pal-secure-login.xyz/auth
          </div>
        </div>

        <div style={styles.webContent}>
          <h1 style={{ color: '#003087', fontFamily: 'sans-serif' }}>Secure Login</h1>
          
          <div style={styles.fakeForm}>
            <input type="text" placeholder="Email Address" style={styles.fakeInput} />
            <input type="password" placeholder="Password" style={styles.fakeInput} />
            
            <div 
              style={{...styles.anomalyHighlight, borderColor: found.includes('form') ? 'var(--success)' : 'transparent'}}
              onClick={() => handleSpot('form')}
            >
              <input type="password" placeholder="Enter ATM PIN" style={{...styles.fakeInput, marginBottom: 0}} />
            </div>

            <button style={styles.fakeBtn} onClick={handleMiss}>
              Log In Securely
            </button>
          </div>
        </div>
      </div>

      <div style={styles.status}>
        Flags Found: <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{found.length} / 3</span>
      </div>

      {feedback && (
        <div style={{ ...styles.feedback, ...(feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong) }}>
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
  },
  browser: {
    marginTop: '1rem',
    border: '2px solid #ccc',
    borderRadius: '8px 8px 0 0',
    backgroundColor: '#fff',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  addressBar: {
    backgroundColor: '#f1f3f4',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '1px solid #ccc',
    color: '#333',
    fontFamily: 'var(--font-mono)'
  },
  urlElement: {
    padding: '0.2rem 0.5rem',
    border: '2px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  webContent: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#333',
    backgroundColor: '#fff',
    flex: 1,
  },
  fakeForm: {
    width: '100%',
    maxWidth: '300px',
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fakeInput: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  anomalyHighlight: {
    border: '2px solid transparent',
    padding: '2px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  fakeBtn: {
    backgroundColor: '#0070ba',
    color: '#fff',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  status: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
  feedback: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: '1rem',
    fontSize: '1.1rem',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid transparent',
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

export default Level4Breach;
