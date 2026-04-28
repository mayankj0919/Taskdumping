import './Toast.css';

function Toast({ message, type = 'success' }) {
  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

export default Toast;