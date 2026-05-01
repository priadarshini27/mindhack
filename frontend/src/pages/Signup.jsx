import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { api } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if(formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.signup(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Make sure user-service is running on port 8050.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <FaUserPlus size={50} color="var(--accent-color)" />
          <h2 style={{ marginTop: '1rem' }}>Agent Registration</h2>
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
              placeholder="Choose an Agent ID"
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
              placeholder="Create a secure passphrase"
            />
          </div>

          <div className="input-group">
            <label>Confirm Passphrase</label>
            <input 
              type="password" 
              name="confirmPassword" 
              required 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="Re-enter your passphrase"
            />
          </div>
          
          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already an agent? <Link to="/login">Login</Link>
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

export default Signup;
