import { useEffect, useRef } from 'react';
import './Sidebar.css';

function Sidebar({ entries, onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="sidebar glass">
      <div className="sidebar-header">
        <span className="sidebar-title">TERMINAL</span>
        <button className="sidebar-close" onClick={onClose}>×</button>
      </div>
      <div className="sidebar-content" ref={containerRef}>
        {entries.map(entry => (
          <div key={entry.id} className={`log-entry ${entry.type}`}>
            <span className="log-time">
              {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </span>
            <span className="log-text">{entry.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;