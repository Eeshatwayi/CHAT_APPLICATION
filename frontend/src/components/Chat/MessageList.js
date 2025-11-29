import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Chat.css';

const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">No messages yet. Start the conversation!</div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`message ${msg.sender._id === user.id ? 'own-message' : ''}`}
          >
            <div className="message-header">
              <img
                src={msg.sender.avatar || 'https://via.placeholder.com/40'}
                alt={msg.sender.username}
                className="message-avatar"
              />
              <span className="message-username">{msg.sender.username}</span>
              <span className="message-time">{formatTime(msg.createdAt)}</span>
            </div>
            <div className="message-content">
              {msg.fileUrl && msg.fileType === 'image' && (
                <img src={msg.fileUrl} alt="uploaded" className="message-image" />
              )}
              {msg.content && <p>{msg.content}</p>}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;