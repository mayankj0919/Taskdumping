import { Handle, Position } from '@xyflow/react';
import './CoreNode.css';

function CoreNode({ data }) {
  return (
    <div className="core-node">
      <Handle type="source" position={Position.Right} className="core-handle" />
      <div className="core-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </div>
      <span className="core-label">{data.label || 'Neural Core'}</span>
      <span className="core-status">{data.state || 'running'}</span>
    </div>
  );
}

export default CoreNode;