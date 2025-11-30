import React, { useState, useEffect } from 'react';
import { getSocket } from '../../services/socket';
import { roomAPI } from '../../services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RoomList from './RoomList';
import './Chat.css';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [currentRoomType, setCurrentRoomType] = useState('public');
  const [currentRoomName, setCurrentRoomName] = useState('General');
  const [roomCode, setRoomCode] = useState('');   // NEW
  const [isTyping, setIsTyping] = useState(false);

  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('load-messages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user-typing', (data) => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    return () => {
      socket.off('load-messages');
      socket.off('receive-message');
      socket.off('user-typing');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', currentRoom);

    return () => {
      socket.emit('leave-room', currentRoom);
    };
  }, [currentRoom, socket]);

  // 🔥 Fetch room details (code) for private rooms
  const fetchPrivateRoom = async (roomId) => {
    try {
      const res = await roomAPI.getRoomMembers(roomId);
      setRoomCode(res.data.code || res.data.room?.code);
    } catch (err) {
      console.log("Could not load room details");
    }
  };

  // 🔥 Switch rooms
  const handleRoomChange = (roomId, roomType, roomName) => {
    setMessages([]);
    setCurrentRoom(roomId);
    setCurrentRoomType(roomType);
    setCurrentRoomName(roomName);

    if (roomType === "private") {
      fetchPrivateRoom(roomId);
    } else {
      setRoomCode('');
    }
  };

  const handleSendMessage = (content, fileUrl = null, fileType = 'none', fileName = null) => {
    socket.emit('send-message', {
      room: currentRoom,
      content,
      fileUrl,
      fileType,
      fileName
    });
  };

  return (
    <div className="chat-container">
      <RoomList 
        currentRoom={currentRoom}
        onRoomChange={handleRoomChange}
      />

      <div className="chat-main">
        <div className="chat-header">
          <h2>
            {currentRoomType === 'private' ? '🔒' : '#'} {currentRoomName}
          </h2>

          {currentRoomType === 'private' && (
            <div className="private-room-info">
              <span className="room-badge">Private Room</span>
              {roomCode && (
                <span className="private-room-code">
                  Code: <b>{roomCode}</b>
                </span>
              )}
            </div>
          )}
        </div>

        <MessageList messages={messages} />

        {isTyping && <div className="typing-indicator">Someone is typing...</div>}

        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;
