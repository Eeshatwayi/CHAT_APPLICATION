import React, { useState, useRef } from 'react';
import { uploadAPI } from '../../services/api';
import ImagePreview from './ImagePreview';
import './Chat.css';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's a file, upload it first
    if (selectedFile) {
      setUploading(true);
      try {
        const response = await uploadAPI.uploadFile(selectedFile);
console.log('✅ Upload response:', response.data);

const { fileUrl, fileType, fileName } = response.data;

// Send message with file
onSendMessage(message.trim() || '', fileUrl, fileType, fileName);
        
        setMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload file. Please try again.');
      } finally {
        setUploading(false);
      }
    } else if (message.trim()) {
      // Send text-only message
      onSendMessage(message, null, 'none');
      setMessage('');
    }
  };

  return (
    <div className="message-input-wrapper">
      {selectedFile && (
        <ImagePreview file={selectedFile} onRemove={handleRemoveFile} />
      )}
      
      <form className="message-input" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          // accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          accept="*"
          style={{ display: 'none' }}
        />
        
        <button
          type="button"
          className="attachment-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Attach file"
        >
          📎
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedFile ? "Add a caption (optional)" : "Type a message..."}
          className="message-input-field"
          disabled={uploading}
        />

        <button 
          type="submit" 
          className="send-button"
          disabled={uploading || (!message.trim() && !selectedFile)}
        >
          {uploading ? '⏳' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;