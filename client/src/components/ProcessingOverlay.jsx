import { useState, useEffect } from 'react';
import './ProcessingOverlay.css';

const MESSAGES = [
  'Analyzing brain dump...',
  'Extracting task entities...',
  'Computing dependencies...',
  'Building execution graph...',
  'Optimizing sequence...',
  'Finalizing workflow...'
];

function ProcessingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="processing-overlay">
      <div className="processing-content">
        <div className="processing-animation">
          <div className="processing-ring ring-1"></div>
          <div className="processing-ring ring-2"></div>
          <div className="processing-ring ring-3"></div>
          <div className="processing-core"></div>
        </div>
        <p className="processing-message">{MESSAGES[messageIndex]}</p>
      </div>
    </div>
  );
}

export default ProcessingOverlay;