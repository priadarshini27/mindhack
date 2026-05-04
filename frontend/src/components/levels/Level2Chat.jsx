import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaBan, FaShieldAlt } from 'react-icons/fa';

const Level2Chat = ({ onAction }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "URGENT: 3 unauthorized transactions of $950.00 detected on your debit card ending in 4021.", sender: 'them' },
    { id: 2, text: "Reply YES to authorize or NO to decline.", sender: 'them' }
  ]);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { id: prev.length + 1, text, sender }]);
  };

  const handleReply = (actionType) => {
    if (conversationEnded) return;

    if (round === 0) {
      if (actionType === 'no') {
        addMessage('NO, I did not authorize this.', 'me');
        addMessage('Fine. If you don\'t confirm, I will cancel your card and you will lose access.', 'them');
        addMessage('Send the 6-digit verification code I just sent to your device now.', 'them');
        setRound(1);
      } else if (actionType === 'call') {
        addMessage('I am going to call my bank now.', 'me');
        addMessage('There is no time for that. Reply YES to keep your account active.', 'them');
        addMessage('The card is on hold until I hear back from you.', 'them');
        setRound(1);
      } else if (actionType === 'ignore') {
        addMessage('Ignore the message; I will check with the bank later.', 'me');
        addMessage('If you ignore this, somebody else will empty your account. Reply YES or NO.', 'them');
        setRound(1);
      }
    } else if (round === 1) {
      if (actionType === 'yes') {
        setFeedback({ correct: false, message: 'Incorrect! This is an aggressive scam trying to force you to authenticate. You should never agree to this.' });
        setConversationEnded(true);
        setTimeout(() => onAction(false, 0, true), 2000);
      } else if (actionType === 'no') {
        addMessage('NO, I will not authorize this.', 'me');
        addMessage('You are putting your account at risk. If you do not verify, your access will be terminated.', 'them');
        addMessage('Send the code or I will escalate this immediately.', 'them');
        setRound(2);
      } else if (actionType === 'report') {
        setFeedback({ correct: true, message: 'Great call. You recognized the scam and reported it instead of engaging with the attacker.' });
        setConversationEnded(true);
        setTimeout(() => onAction(true, 150, true), 2000);
      }
    } else if (round === 2) {
      if (actionType === 'give_otp') {
        addMessage('Here is the code: 847291', 'me');
        setFeedback({ correct: false, message: 'Incorrect decision. You just gave a scammer the one-time code for your account!' });
        setConversationEnded(true);
        setTimeout(() => onAction(false, 0, true), 2000);
      } else if (actionType === 'block') {
        setFeedback({ correct: true, message: 'Correct decision! A real bank will never ask for your OTP through a chat alert like this.' });
        setConversationEnded(true);
        setTimeout(() => onAction(true, 200, true), 2000);
      }
    }
  };

  const renderButtons = () => {
    if (feedback) return null;

    if (round === 0) {
      return (
        <>
          <button className="btn" onClick={() => handleReply('no')}>Reply "NO"</button>
          <button className="btn" onClick={() => handleReply('call')}>Call My Bank</button>
          <button className="btn btn-danger" onClick={() => handleReply('ignore')}><FaBan /> Ignore</button>
        </>
      );
    }

    if (round === 1) {
      return (
        <>
          <button className="btn" onClick={() => handleReply('no')}>Reply "NO" Again</button>
          <button className="btn btn-danger" onClick={() => handleReply('yes')}><FaBan /> Reply YES</button>
          <button className="btn" onClick={() => handleReply('report')}><FaShieldAlt /> Report</button>
        </>
      );
    }

    if (round === 2) {
      return (
        <>
          <button className="btn btn-danger" onClick={() => handleReply('give_otp')}>Provide OTP</button>
          <button className="btn" onClick={() => handleReply('block')}><FaShieldAlt /> Block & Report</button>
        </>
      );
    }

    return null;
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaCommentDots /> Level 2: Chat Trap
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        A scammer is impersonating your bank. Keep the conversation going and do not give them your OTP.
      </p>

      <div style={styles.chatBox}>
        {messages.map(m => (
          <div key={m.id} style={m.sender === 'me' ? styles.msgRight : styles.msgLeft}>
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {feedback ? (
        <div style={{ ...styles.feedback, ...(feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong) }}>
          {feedback.message}
          {feedback.correct && <div style={{ marginTop: '0.5rem', color: 'var(--success)', fontWeight: 700 }}>Level Complete!</div>}
        </div>
      ) : (
        <div style={styles.actions}>
          {renderButtons()}
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

export default Level2Chat;
