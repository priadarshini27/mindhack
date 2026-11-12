import React, { useState } from 'react';
import { FaInbox, FaEnvelope, FaExclamationTriangle, FaCheck, FaCheckCircle } from 'react-icons/fa';

const Level1Inbox = ({ onAction }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [processedEmails, setProcessedEmails] = useState([]);

  const emails = [
    { id: 1, sender: 'HR Department', email: 'hr@mindhack-corp.com', subject: 'Action Required: Updated Security Policy', isPhishing: false, body: 'Please review the attached security policy for Q3. Ensure you complete the acknowledgment form by Friday.' },
    { id: 2, sender: 'IT Support', email: 'it-admin@mindhack-c0rp.com', subject: 'URGENT: Password Expiry Notification', isPhishing: true, body: 'Your account password expires in 2 hours. Click the link below immediately to retain access to your emails.' },
    { id: 3, sender: 'Project Manager', email: 'pm@mindhack-corp.com', subject: 'Meeting notes from yesterday', isPhishing: false, body: 'Attached are the notes from our sync. Let me know if anything was missed.' },
    { id: 4, sender: 'CEO John', email: 'john.ceo@gmail.com', subject: 'Are you at your desk?', isPhishing: true, body: 'I need you to process an urgent wire transfer for a vendor. Reply back as soon as you get this.' },
    { id: 5, sender: 'Internal Comms', email: 'news@mindhack-corp.com', subject: 'Monthly Newsletter: August', isPhishing: false, body: 'Check out the latest updates from our teams around the globe. Spotlight on the Engineering department this month!' }
  ];

  const handleDecision = (markPhishing) => {
    if (!selectedEmail) return;

    const isCorrect = markPhishing === selectedEmail.isPhishing;
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? 'Correct decision.' : 'Incorrect decision.'
    });

    const updatedProcessed = [...processedEmails, selectedEmail.id];
    setProcessedEmails(updatedProcessed);

    const isLevelComplete = updatedProcessed.length === emails.length;
    
    onAction(isCorrect, 20, isLevelComplete);
  };

  return (
    <div className="card animate-fade-in" style={styles.container}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaInbox /> Level 1: Suspicious Inbox
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Review the emails. Classify all 5 emails to proceed. ({processedEmails.length}/5)
      </p>

      <div style={styles.layout}>
        <div style={styles.list}>
          {emails.map(email => {
            const isProcessed = processedEmails.includes(email.id);
            return (
              <div 
                key={email.id} 
                style={{
                  ...styles.emailItem, 
                  backgroundColor: selectedEmail?.id === email.id ? 'var(--bg-color)' : 'transparent',
                  opacity: isProcessed ? 0.5 : 1
                }}
                onClick={() => { 
                  setSelectedEmail(email); 
                  setFeedback(null); 
                }}
              >
                <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                  {email.sender}
                  {isProcessed && <FaCheckCircle color="var(--text-secondary)" />}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{email.subject}</div>
              </div>
            );
          })}
        </div>

        <div style={styles.preview}>
          {selectedEmail ? (
            <div>
              <div style={styles.emailHeader}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedEmail.subject}</div>
                <div>From: {selectedEmail.sender} &lt;<span style={{ color: 'var(--text-main)' }}>{selectedEmail.email}</span>&gt;</div>
              </div>
              <div style={styles.emailBody}>
                {selectedEmail.body}
              </div>

              {processedEmails.includes(selectedEmail.id) || feedback ? (
                <div style={{...styles.feedback, ...(feedback ? (feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong) : {}) }}>
                  {feedback ? feedback.message : 'You have already classified this email.'}
                  {processedEmails.length === emails.length && feedback?.correct && (
                    <div style={{ marginTop: '1rem', color: 'var(--success)', fontWeight: 700 }}>Level Complete!</div>
                  )}
                </div>
              ) : (
                <div style={styles.actions}>
                  <button className="btn btn-primary" onClick={() => handleDecision(false)}>
                    <FaCheck /> Mark Safe
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDecision(true)}>
                    <FaExclamationTriangle /> Report Phishing
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              <FaEnvelope size={40} style={{ marginBottom: '1rem' }} />
              Select an email to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  layout: {
    display: 'flex',
    gap: '1rem',
    flex: 1,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  list: {
    flex: 1,
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  emailItem: {
    padding: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  preview: {
    flex: 2,
    padding: '1.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  emailHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '1rem',
    marginBottom: '1rem',
  },
  emailBody: {
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  feedback: {
    padding: '1rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
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

export default Level1Inbox;
