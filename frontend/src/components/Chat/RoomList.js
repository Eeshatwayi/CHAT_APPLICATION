// 

import React, { useState, useEffect } from 'react';
import { roomAPI, publicRoomAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CreateRoomModal from './CreateRoomModal';
import JoinRoomModal from './JoinRoomModal';
import RoomCodeModal from './RoomCodeModal';
import CreatePublicRoomModal from './CreatePublicRoomModal.js';



import './Chat.css';

const RoomList = ({ currentRoom, onRoomChange }) => {
  const { user } = useAuth();
  
  // Tabs
  const [activeTab, setActiveTab] = useState('public');

  // Public + Private State
  const [publicRooms, setPublicRooms] = useState([]);
  const [privateRooms, setPrivateRooms] = useState([]);

  // Modals
  const [showCreatePublicModal, setShowCreatePublicModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const [newRoomData, setNewRoomData] = useState({ name: '', code: '' });

  // -------- LOAD ROOMS --------
  useEffect(() => {
    loadPublicRooms();
  }, []);

  useEffect(() => {
    if (activeTab === 'private') loadPrivateRooms();
  }, [activeTab]);

  const loadPublicRooms = async () => {
    try {
      const res = await publicRoomAPI.getPublicRooms();
      setPublicRooms(res.rooms);
    } catch (err) {
      console.error("Error loading public rooms", err);
    }
  };

  const loadPrivateRooms = async () => {
    try {
      const response = await roomAPI.getMyPrivateRooms();
      setPrivateRooms(response.data.rooms);
    } catch (error) {
      console.error('Failed to load private rooms:', error);
    }
  };

  // -------- PRIVATE ROOM CREATE --------
  const handleCreateRoom = async (roomName) => {
    try {
      const response = await roomAPI.createPrivateRoom({ name: roomName });
      setNewRoomData({
        name: response.data.room.name,
        code: response.data.code
      });
      setShowCodeModal(true);
      loadPrivateRooms();
    } catch (error) {
      throw error;
    }
  };

  // -------- PRIVATE ROOM JOIN --------
  const handleJoinRoom = async (code) => {
    try {
      const response = await roomAPI.joinPrivateRoom(code);
      loadPrivateRooms();
      onRoomChange(response.data.room._id, 'private', response.data.room.name);
    } catch (error) {
      throw error;
    }
  };

  // -------- PRIVATE ROOM LEAVE --------
  const handleLeaveRoom = async (roomId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to leave this room?')) {
      try {
        await roomAPI.leavePrivateRoom(roomId);
        loadPrivateRooms();
        if (currentRoom === roomId) {
          onRoomChange('general', 'public', 'General');
        }
      } catch (error) {
        console.error('Failed to leave room:', error);
      }
    }
  };

  // -------- PRIVATE ROOM DELETE --------
  const handleDeleteRoom = async (roomId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this room? This cannot be undone.')) {
      try {
        await roomAPI.deletePrivateRoom(roomId);
        loadPrivateRooms();
        if (currentRoom === roomId) {
          onRoomChange('general', 'public', 'General');
        }
      } catch (error) {
        console.error('Failed to delete room:', error);
        alert(error.response?.data?.message || 'Failed to delete room');
      }
    }
  };

  // -------- PUBLIC ROOM CREATE --------
  const handleCreatePublicRoom = async (roomName) => {
    try {
      await publicRoomAPI.createPublicRoom(roomName);
      setShowCreatePublicModal(false);
      loadPublicRooms();
    } catch (error) {
      console.error("Failed to create public room", error);
    }
  };

  // -------- PUBLIC ROOM JOIN --------
  const handleJoinPublicRoom = async (room) => {
    try {
      await publicRoomAPI.joinPublicRoom(room._id);
      onRoomChange(room._id, 'public', room.name);
    } catch (err) {
      console.error("Join public room error:", err);
    }
  };

  return (
    <div className="room-list">
      <h3>Chat Rooms</h3>

      {/* Tabs */}
      <div className="room-tabs">
        <button
          className={`room-tab ${activeTab === 'public' ? 'active' : ''}`}
          onClick={() => setActiveTab('public')}
        >
          🌐 Public
        </button>

        <button
          className={`room-tab ${activeTab === 'private' ? 'active' : ''}`}
          onClick={() => setActiveTab('private')}
        >
          🔒 Private
        </button>
      </div>

      {/* -------- PUBLIC ROOMS -------- */}
      {activeTab === 'public' && (
        <div className="rooms">
          <button
            className="btn-create-room"
            onClick={() => setShowCreatePublicModal(true)}
          >
            ➕ Create Public Room
          </button>

          {publicRooms.map(room => (
            <div
              key={room._id}
              className={`room-item ${currentRoom === room._id ? 'active' : ''}`}
              onClick={() => handleJoinPublicRoom(room)}
            >
              # {room.name}
            </div>
          ))}
        </div>
      )}

      {/* -------- PRIVATE ROOMS -------- */}
      {activeTab === 'private' && (
        <div className="private-rooms-container">

          <div className="private-room-actions">
            <button 
              className="btn-create-room"
              onClick={() => setShowCreateModal(true)}
            >
              ➕ Create Room
            </button>

            <button 
              className="btn-join-room"
              onClick={() => setShowJoinModal(true)}
            >
              🔑 Join Room
            </button>
          </div>

          <div className="rooms">
            {privateRooms.length === 0 ? (
              <div className="no-rooms">
                <p>No private rooms yet</p>
                <p className="no-rooms-hint">Create or join a room to get started</p>
              </div>
            ) : (
              privateRooms.map(room => (
                <div
                  key={room._id}
                  className={`room-item private ${currentRoom === room._id ? 'active' : ''}`}
                  onClick={() => onRoomChange(room._id, 'private', room.name)}
                >
                  <div className="room-item-content">
                    <span className="room-icon">🔒</span>
                    <span className="room-name">{room.name}</span>
                  </div>

                  <div className="room-item-actions">
                    {room.createdBy._id === user.id ? (
                      <button
                        className="room-action-btn delete"
                        onClick={(e) => handleDeleteRoom(room._id, e)}
                        title="Delete room"
                      >
                        🗑️
                      </button>
                    ) : (
                      <button
                        className="room-action-btn leave"
                        onClick={(e) => handleLeaveRoom(room._id, e)}
                        title="Leave room"
                      >
                        🚪
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* -------- MODALS -------- */}

      {/* Private Create */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
      />

      {/* Private Join */}
      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinRoom}
      />

      {/* Private room code */}
      <RoomCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        roomName={newRoomData.name}
        code={newRoomData.code}
      />

      {/* Public Create */}
      <CreatePublicRoomModal
  isOpen={showCreatePublicModal}
  onClose={() => setShowCreatePublicModal(false)}
  onCreate={handleCreatePublicRoom}
/>

    </div>
  );
};

export default RoomList;
