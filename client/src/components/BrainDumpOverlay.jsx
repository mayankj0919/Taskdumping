import { useState } from 'react';
import './BrainDumpOverlay.css';

const DEMO_TEXT = `Build a new landing page for my SaaS product
Set up PostgreSQL database with the new schema
Write unit tests for the authentication module
Deploy to production on Vercel
Create API documentation
Design the logo and brand colors
Set up CI/CD pipeline with GitHub Actions
Write integration tests for the payment flow
Research competitor pricing strategies
Create user onboarding email sequence
Configure AWS S3 for file storage
Set up monitoring with Datadog`;

function BrainDumpOverlay({ onSynthesize }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (text.trim().length < 5 || isLoading) return;
    setIsLoading(true);
    onSynthesize(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const loadDemo = () => {
    setText(DEMO_TEXT);
  };

  return (
    <div className="brain-dump-overlay">
      <div className="brain-dump-container">
        <div className="brain-dump-logo">
          <svg viewBox="0 0 100 100" className="logo-svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--cyan)" />
                <stop offset="100%" stopColor="var(--purple)" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.3" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="url(#logoGrad)" strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="url(#logoGrad)" />
            <line x1="50" y1="20" x2="50" y2="5" stroke="var(--cyan)" strokeWidth="2" />
            <line x1="50" y1="80" x2="50" y2="95" stroke="var(--cyan)" strokeWidth="2" />
            <line x1="20" y1="50" x2="5" y2="50" stroke="var(--purple)" strokeWidth="2" />
            <line x1="80" y1="50" x2="95" y2="50" stroke="var(--purple)" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="brain-dump-title">
          <span className="gradient-text">Turn Chaos Into Optimal Sequence</span>
        </h1>

        <div className="brain-dump-input-wrapper">
          <textarea
            className="brain-dump-textarea glass"
            placeholder="Dump your tasks here... Describe everything on your mind. We'll organize it into an optimal workflow."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="brain-dump-hint">
            <span>{text.length} characters</span>
            <span>Ctrl + Enter to submit</span>
          </div>
        </div>

        <div className="brain-dump-actions">
          <button className="btn-ghost" onClick={loadDemo}>
            Load Demo
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={text.trim().length < 5}
          >
            Run Neural Synthesis
          </button>
        </div>
      </div>
    </div>
  );
}

export default BrainDumpOverlay;