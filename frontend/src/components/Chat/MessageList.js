import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Chat.css';

const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const getFileName = (url) => {
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    } catch {
      return 'Download file';
    }
  };

  return (
    <>
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
                {/* Image */}
                {msg.fileUrl && msg.fileType === 'image' && (
                  <img 
                    src={msg.fileUrl} 
                    alt="uploaded" 
                    className="message-image"
                    onClick={() => setSelectedImage(msg.fileUrl)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                
                {/* File */}
{msg.fileUrl && msg.fileType === 'file' && (
  <a 
    href={msg.fileUrl} 
    download={msg.fileName}
    target="_blank"
    rel="noopener noreferrer"
    className="message-file"
  >
    <span className="file-icon">📄</span>
    <span className="file-name">{msg.fileName || getFileName(msg.fileUrl)}</span>
    <span className="download-icon">⬇️</span>
  </a>
)}
                
                {/* Text content */}
                {msg.content && <p>{msg.content}</p>}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content">
            <button className="image-modal-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img src={selectedImage} alt="Full size" />
          </div>
        </div>
      )}
    </>
  );
};

export default MessageList;