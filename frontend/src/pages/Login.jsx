import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { api, authToGameUser } from '../services/api';
import { FaUserShield } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = await api.login(formData);
      dispatch({ type: 'LOGIN', payload: authToGameUser(auth, formData.username) });
      navigate(auth.user.oathCompleted ? '/dashboard' : '/oath');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Make sure user-service is running on port 8050.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <FaUserShield size={50} color="var(--accent-color)" />
          <h2 style={{ marginTop: '1rem' }}>Agent Login</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Agent ID (Username)</label>
            <input 
              type="text" 
              name="username" 
              required 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Enter your Agent ID"
            />
          </div>
          
          <div className="input-group">
            <label>Passphrase</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your secure passphrase"
            />
          </div>
          
          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          New agent? <Link to="/signup">Request Access</Link>
        </p>
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
    maxWidth: '400px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  error: {
    color: 'var(--danger)',
    marginTop: '0.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
};

export default Login;
