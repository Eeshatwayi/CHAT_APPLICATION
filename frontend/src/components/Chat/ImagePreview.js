import React from 'react';
import './Chat.css';

const ImagePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = React.useState(null);

  React.useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (!file) return null;

  const isImage = file.type.startsWith('image/');

  return (
    <div className="image-preview-container">
      <div className="image-preview">
        {isImage ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div className="file-preview">
            <span className="file-icon">📄</span>
            <span className="file-name">{file.name}</span>
          </div>
        )}
        <button className="remove-preview" onClick={onRemove}>
          ✕
        </button>
      </div>
      <div className="preview-info">
        <span className="file-size">
          {(file.size / 1024).toFixed(2)} KB
        </span>
      </div>
    </div>
  );
};

export default ImagePreview;