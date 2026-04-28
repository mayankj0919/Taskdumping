import './InspectPanel.css';

function InspectPanel({ node, onClose, onMarkComplete, onDeepDive }) {
  const data = node?.data || {};
  const isComplete = data.state === 'complete';

  const depList = data.deps || [];

  return (
    <div className="inspect-panel glass">
      <div className="inspect-header">
        <h3>Task Details</h3>
        <button className="inspect-close" onClick={onClose}>×</button>
      </div>

      <div className="inspect-content">
        <div className="inspect-label">
          <span className={`state-dot ${data.state}`}></span>
          <h2>{data.label || 'Untitled Task'}</h2>
        </div>

        {data.desc && (
          <div className="inspect-section">
            <label>Description</label>
            <p>{data.desc}</p>
          </div>
        )}

        <div className="inspect-row">
          <div className="inspect-section">
            <label>Priority</label>
            <span className={`priority-badge ${data.priority}`}>
              {data.priority || 'medium'}
            </span>
          </div>

          <div className="inspect-section">
            <label>Status</label>
            <span className={`status-badge ${data.state}`}>
              {data.state || 'pending'}
            </span>
          </div>
        </div>

        {data.reason && (
          <div className="inspect-section">
            <label>Reasoning</label>
            <p className="inspect-reason">{data.reason}</p>
          </div>
        )}

        {depList.length > 0 && (
          <div className="inspect-section">
            <label>Dependencies</label>
            <div className="inspect-deps">
              {depList.map(dep => (
                <span key={dep} className="dep-tag">{dep}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="inspect-actions">
        <button
          className={`btn-ghost ${isComplete ? 'active' : ''}`}
          onClick={() => onMarkComplete(node.id)}
        >
          {isComplete ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button className="btn-primary" onClick={() => onDeepDive(node.id)}>
          Break Down Task
        </button>
      </div>
    </div>
  );
}

export default InspectPanel;