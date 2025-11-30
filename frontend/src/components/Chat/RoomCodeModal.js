import React, { useState } from 'react';
import './Chat.css';

const RoomCodeModal = ({ isOpen, onClose, roomName, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎉 Room Created!</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="room-code-display">
          <p className="room-code-label">Room: <strong>{roomName}</strong></p>
          <div className="code-box">
            <span className="code-text">{code}</span>
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <p className="room-code-info">
            Share this code with friends to invite them to your private room
          </p>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-primary">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCodeModal;