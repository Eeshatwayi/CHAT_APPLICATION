import React, { useState, useEffect } from 'react';
import { getSocket } from '../../services/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RoomList from './RoomList';
import './Chat.css';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    // Join initial room
    socket.emit('join-room', currentRoom);

    // Listen for previous messages
    socket.on('load-messages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    // Listen for new messages
    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user joined
    socket.on('user-joined', (data) => {
      console.log(data.message);
    });

    // Listen for typing
    socket.on('user-typing', (data) => {
      setIsTyping(data.isTyping);
      setTimeout(() => setIsTyping(false), 3000);
    });

    return () => {
      socket.off('load-messages');
      socket.off('receive-message');
      socket.off('user-joined');
      socket.off('user-typing');
    };
  }, [socket, currentRoom]);

  const handleRoomChange = (roomId) => {
    socket.emit('join-room', roomId);
    setCurrentRoom(roomId);
    setMessages([]);
  };

  const handleSendMessage = (content) => {
    socket.emit('send-message', {
      room: currentRoom,
      content,
      fileUrl: null,
      fileType: 'none'
    });
  };

  return (
    <div className="chat-container">
      <RoomList currentRoom={currentRoom} onRoomChange={handleRoomChange} />
      <div className="chat-main">
        <div className="chat-header">
          <h2># {currentRoom}</h2>
        </div>
        <MessageList messages={messages} />
        {isTyping && <div className="typing-indicator">Someone is typing...</div>}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;