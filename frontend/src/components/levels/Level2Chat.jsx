import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaBan, FaShieldAlt } from 'react-icons/fa';

const Level2Chat = ({ onAction }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "URGENT: 3 unauthorized transactions of $950.00 detected on your debit card ending in 4021.", sender: 'them' }
  ]);
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, feedback]);

  useEffect(() => {
    if (step === 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: 2, text: "Reply YES to authorize or NO to decline.", sender: 'them' }]);
      }, 1500);
    } else if (step === 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: 4, text: "We have frozen your card. To reverse these charges and secure your account immediately, our fraud prevention team needs to verify your identity.", sender: 'them' }]);
      }, 1500);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: 5, text: "Failure to verify within 5 minutes will result in permanent account closure and the funds will NOT be recovered.", sender: 'them' }]);
      }, 3500);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: 6, text: "I am sending a secure 6-digit verification code to your device now. Reply with this code immediately.", sender: 'them' }]);
      }, 5500);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: 7, text: "DO NOT IGNORE THIS MESSAGE. The hackers are currently attempting another transfer.", sender: 'them' }]);
        setStep(2);
      }, 7500);
    }
  }, [step]);

  const handleReply = (actionType) => {
    if (feedback) return;
    
    if (step === 0) {
      if (actionType === 'no') {
        setMessages(prev => [...prev, { id: 3, text: "NO", sender: 'me' }]);
        setStep(1);
      } else {
        setFeedback({ correct: false, message: "Incorrect decision. By ignoring, you leave your account vulnerable to the scammers." });
        onAction(false, 0, false);
      }
    } else if (step === 2) {
      if (actionType === 'give_otp') {
        setMessages(prev => [...prev, { id: 8, text: "Here is the code: 847291", sender: 'me' }]);
        setFeedback({ correct: false, message: "Incorrect decision. You just gave a scammer the 2FA code to empty your account!" });
        setTimeout(() => onAction(false, 0, false), 2000);
      } else if (actionType === 'block') {
        setFeedback({ correct: true, message: "Correct decision. A real bank will never ask for your OTP over SMS. Good block." });
        setTimeout(() => onAction(true, 150, true), 2000);
      }
    }
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaCommentDots /> Level 2: Urgent SMS
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Message from: Global Bank Alerts
      </p>

      <div style={styles.chatBox}>
        {messages.map(m => (
          <div key={m.id} style={m.sender === 'me' ? styles.msgRight : styles.msgLeft}>
            {m.text}
          </div>
        ))}
        {step === 1 && messages.length < 7 && (
          <div style={{...styles.msgLeft, color: 'var(--text-secondary)', fontStyle: 'italic', background: 'transparent'}}>
            typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {feedback ? (
        <div style={styles.feedback}>
          {feedback.message}
          {feedback.correct && <div style={{marginTop: '0.5rem', color: 'var(--accent-color)'}}>Level Complete!</div>}
        </div>
      ) : (
        <div style={styles.actions}>
          {step === 0 && messages.length >= 2 && (
            <>
              <button className="btn" onClick={() => handleReply('no')}>Reply "NO"</button>
              <button className="btn btn-danger" onClick={() => handleReply('ignore')}><FaBan /> Ignore</button>
            </>
          )}
          {step === 2 && (
            <>
              <button className="btn btn-danger" onClick={() => handleReply('give_otp')}>Provide OTP</button>
              <button className="btn" onClick={() => handleReply('block')}><FaShieldAlt /> Report as Fraud</button>
            </>
          )}
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
  chatBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  msgLeft: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0.75rem 1rem',
    borderRadius: '12px 12px 12px 0',
    maxWidth: '75%',
    lineHeight: '1.4',
  },
  msgRight: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    border: '1px solid rgba(0, 229, 255, 0.3)',
    color: 'var(--text-main)',
    padding: '0.75rem 1rem',
    borderRadius: '12px 12px 0 12px',
    maxWidth: '75%',
    lineHeight: '1.4',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'center',
  },
  feedback: {
    padding: '1rem',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }
};

export default Level2Chat;
