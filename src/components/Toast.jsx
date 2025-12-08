import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaExclamationTriangle } from 'react-icons/fa'; // Import icon
import '../styles/Toast.css';

function Toast({ message, type = 'error', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const toastContent = (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'error' && <FaExclamationTriangle className="toast-icon" />} {/* */}
        {type === 'success' && <span className="toast-icon">✓</span>}
        <div className="toast-message">
          {Array.isArray(message)
            ? message.map((msg, idx) => <div key={idx}>{msg}</div>)
            : message}
        </div>
        <button
          className="toast-close"
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
}

export default Toast;
