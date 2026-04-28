import { Handle, Position } from '@xyflow/react';
import './TaskNode.css';

function TaskNode({ data, selected }) {
  const priority = data.priority || 'medium';
  const state = data.state || 'pending';

  return (
    <div className={`task-node ${priority} ${state} ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="task-handle target" />
      
      <div className="task-header">
        <span className="task-index">#{data.index}</span>
        {state === 'complete' && (
          <span className="task-check">✓</span>
        )}
      </div>
      
      <div className="task-content">
        <span className="task-label">{data.label}</span>
        {data.desc && <span className="task-desc">{data.desc}</span>}
      </div>
      
      <div className="task-footer">
        <span className={`task-priority ${priority}`}>{priority}</span>
      </div>
      
      <Handle type="source" position={Position.Right} className="task-handle source" />
    </div>
  );
}

export default TaskNode;