import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero} className="animate-fade-in">
        <FaShieldAlt size={80} color="var(--accent-color)" className="pulse-glow" style={{ borderRadius: '50%' }} />
        <h1 style={styles.title}>MindHack</h1>
        <p style={styles.subtitle}>
          The Ultimate Cybersecurity Awareness Simulation
        </p>
        <p style={styles.description}>
          Test your instincts against real-world cyber threats. No boring quizzes—only highly realistic simulations.
          Can you spot the phishing email, dodge the chat trap, and escape the breach?
        </p>
        <div style={styles.actions}>
          <Link to="/login" className="btn btn-primary" style={{ marginRight: '1rem' }}>
            Start Mission
          </Link>
          <Link to="/signup" className="btn">
            Create Agent Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },
  hero: {
    maxWidth: '800px',
    textAlign: 'center',
  },
  title: {
    fontSize: '4rem',
    color: 'var(--accent-color)',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    margin: '1.5rem 0 0.5rem',
    textShadow: '0 0 20px var(--accent-glow)',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: 'var(--text-main)',
    marginBottom: '2rem',
  },
  description: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '3rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  }
};

export default Home;
