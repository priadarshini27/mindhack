import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { FaLock } from 'react-icons/fa';
import { api } from '../services/api';

const Oath = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  
  const [pledges, setPledges] = useState({
    otp: false,
    links: false,
    email: false,
    urgency: false,
    website: false
  });
  
  const [allChecked, setAllChecked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAllChecked = Object.values(pledges).every(Boolean);
    setAllChecked(isAllChecked);
  }, [pledges]);

  const handleCheckboxChange = (e) => {
    setPledges({
      ...pledges,
      [e.target.name]: e.target.checked
    });
  };

  const handleStartMission = async () => {
    if (allChecked) {
      setError('');
      setLoading(true);
      try {
        if (state.user?.id) {
          await api.oath(state.user.id, Object.keys(pledges).filter((key) => pledges[key]));
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Could not save oath. Make sure user-service is running on port 8050.');
        setLoading(false);
        return;
      }
      dispatch({ type: 'TAKE_OATH' });
      navigate('/game');
    }
  };

  return (
    <div style={styles.container}>
      <div className="card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <FaLock size={40} color="var(--accent-color)" />
          <h2 style={styles.title}>Security Oath</h2>
        </div>
        
        <p style={styles.instruction}>
          To access the simulation, you must pledge to uphold basic security principles. 
          Check all boxes to proceed.
        </p>

        <div style={styles.pledgeList}>
          <label style={styles.pledgeItem}>
            <input 
              type="checkbox" 
              name="otp" 
              checked={pledges.otp} 
              onChange={handleCheckboxChange} 
              style={styles.checkbox}
            />
            I will never share my OTP or passwords
          </label>
          
          <label style={styles.pledgeItem}>
            <input 
              type="checkbox" 
              name="links" 
              checked={pledges.links} 
              onChange={handleCheckboxChange} 
              style={styles.checkbox}
            />
            I will not click unknown or suspicious links
          </label>
          
          <label style={styles.pledgeItem}>
            <input 
              type="checkbox" 
              name="email" 
              checked={pledges.email} 
              onChange={handleCheckboxChange} 
              style={styles.checkbox}
            />
            I will verify email senders before acting
          </label>
          
          <label style={styles.pledgeItem}>
            <input 
              type="checkbox" 
              name="urgency" 
              checked={pledges.urgency} 
              onChange={handleCheckboxChange} 
              style={styles.checkbox}
            />
            I will not trust urgent messages blindly
          </label>
          
          <label style={styles.pledgeItem}>
            <input 
              type="checkbox" 
              name="website" 
              checked={pledges.website} 
              onChange={handleCheckboxChange} 
              style={styles.checkbox}
            />
            I will check website authenticity before login
          </label>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '2rem' }}
          disabled={!allChecked || loading}
          onClick={handleStartMission}
        >
          {loading ? 'Saving Oath...' : 'Start Mission'}
        </button>
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
    maxWidth: '600px',
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    marginTop: '1rem',
    color: 'var(--accent-color)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  instruction: {
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  pledgeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  pledgeItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '1rem',
    backgroundColor: 'var(--bg-color)',
    border: '1px solid var(--bg-color-lighter)',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  checkbox: {
    marginRight: '1rem',
    width: '18px',
    height: '18px',
    accentColor: 'var(--accent-color)',
    cursor: 'pointer'
  },
  error: {
    color: 'var(--danger)',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
};

export default Oath;
