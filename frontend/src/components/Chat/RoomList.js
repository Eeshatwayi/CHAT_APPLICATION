import React, { useState } from 'react';
import './Chat.css';

const RoomList = ({ currentRoom, onRoomChange }) => {
  const [rooms] = useState([
    { id: 'general', name: 'General' },
    { id: 'random', name: 'Random' },
    { id: 'tech', name: 'Tech Talk' },
    { id: 'gaming', name: 'Gaming' }
  ]);

  return (
    <div className="room-list">
      <h3>Chat Rooms</h3>
      <div className="rooms">
        {rooms.map(room => (
          <div
            key={room.id}
            className={`room-item ${currentRoom === room.id ? 'active' : ''}`}
            onClick={() => onRoomChange(room.id)}
          >
            # {room.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;