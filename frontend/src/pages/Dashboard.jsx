import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { FaUserShield, FaFire, FaTrophy, FaMedal, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: 'var(--accent-color)' }}>Agent Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Welcome back, Agent {state.user?.username || 'Guest'}. Review your cyber defense metrics.
      </p>

      <div style={styles.grid}>
        <div className="card" style={styles.statCard}>
          <FaMedal size={40} color="var(--accent-color)" />
          <h3 style={{ marginTop: '1rem' }}>Current Rank</h3>
          <p style={styles.statValue}>{state.rank || 'Beginner'}</p>
        </div>

        <div className="card" style={styles.statCard}>
          <FaTrophy size={40} color="gold" />
          <h3 style={{ marginTop: '1rem' }}>Best Score</h3>
          <p style={styles.statValue}>{state.bestScore || 0}</p>
        </div>

        <div className="card" style={styles.statCard}>
          <FaFire size={40} color="orange" />
          <h3 style={{ marginTop: '1rem' }}>Best Streak</h3>
          <p style={styles.statValue}>{state.bestStreak || 0} Correct Actions</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
        <Link to="/oath" className="btn btn-primary pulse-glow">
          Start New Simulation
        </Link>
        <Link to="/leaderboard" className="btn">
          View Global Leaderboard
        </Link>
        <button onClick={handleLogout} className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center' }}>
          <FaSignOutAlt style={{ marginRight: '0.5rem' }} /> Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-main)'
  }
};

export default Dashboard;
