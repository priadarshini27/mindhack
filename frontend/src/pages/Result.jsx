import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaRedo } from 'react-icons/fa';

const Result = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const isSuccess = state.gameStatus === 'completed';

  const handleRetake = () => {
    dispatch({ type: 'START_GAME' });
    navigate('/game');
  };

  return (
    <div style={styles.container}>
      <div className="card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          {isSuccess ? (
            <FaCheckCircle size={60} color="var(--success)" />
          ) : (
            <FaTimesCircle size={60} color="var(--danger)" />
          )}
          <h2 style={{ marginTop: '1rem', color: isSuccess ? 'var(--success)' : 'var(--danger)' }}>
            {isSuccess ? 'Simulation Complete' : 'Simulation Failed'}
          </h2>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statRow}>
            <span>Final Score:</span>
            <span style={styles.value}>{state.score}</span>
          </div>
          <div style={styles.statRow}>
            <span>Rank Achieved:</span>
            <span style={{...styles.value, color: 'var(--accent-color)'}}>{state.rank}</span>
          </div>
          <div style={styles.statRow}>
            <span>Best Streak:</span>
            <span style={styles.value}>{state.bestStreak}</span>
          </div>
          <div style={styles.statRow}>
            <span>Lifelines Remaining:</span>
            <span style={styles.value}>{state.lifelines}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isSuccess ? (
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRetake}>
              <FaRedo /> Retake from Level 1
            </button>
          ) : (
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRetake}>
              <FaRedo /> Play Again
            </button>
          )}
          <Link to="/analysis" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            View AI Improvement Analysis
          </Link>
          <Link to="/dashboard" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
            Return to Dashboard
          </Link>
          <Link to="/leaderboard" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
            View Leaderboard
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
    padding: '1rem'
  },
  card: {
    width: '100%',
    maxWidth: '500px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  statsContainer: {
    backgroundColor: 'var(--bg-color)',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid var(--bg-color-lighter)'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid var(--bg-color-lighter)',
    fontFamily: 'var(--font-mono)'
  },
  value: {
    fontWeight: 'bold',
    color: 'var(--text-main)'
  }
};

export default Result;
