import React, { useState } from 'react';
import './Chat.css';

const JoinRoomModal = ({ isOpen, onClose, onJoin }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Room code is required');
      return;
    }

    if (code.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onJoin(code.toUpperCase());
      setCode('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Join Private Room</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength="6"
              autoFocus
              style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
            />
          </div>
          
          <div className="modal-info">
            <p>🔑 Enter the code shared by the room creator</p>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;