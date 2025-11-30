import React, { useState } from 'react';
import './Chat.css'; // use existing modal styles

const CreatePublicRoomModal = ({ isOpen, onClose, onCreate }) => {
  const [roomName, setRoomName] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!roomName.trim()) return;
    onCreate(roomName);
    setRoomName('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="modal-header">
          <h3>Create Public Room</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* INPUT */}
        <div className="form-group">
          <label>Room Name</label>
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            autoFocus
          />
        </div>

        {/* BUTTONS */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleCreate}>
            Create Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePublicRoomModal;
