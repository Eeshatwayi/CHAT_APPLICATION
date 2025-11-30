import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
          Enter your new password
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              minLength="6"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {message && (
          <div className="success-message" style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            borderRadius: '4px' 
          }}>
            {message}
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}

        <p className="auth-link">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;