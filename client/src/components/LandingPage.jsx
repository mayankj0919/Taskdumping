import { useState } from 'react';
import './LandingPage.css';

const HERO_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC42JPsj7NwYjcaP2KxTG1Xpd_2Eod3bQ7dS0PrK-6kUedeNYNeenoR4D2HCRhEz5Ym0CLeu1ETDJ23nsAItBHHQE6XEOg_xReQMNEmrzlY2oIrmCqlJWxvB39noLQpKfz-Un0hfII4iDU6aZ2GgY8CZo6yGu004u2jjYNTVIk_ZpK8gteGoZSVZE6QyRheb4TSN-9yI9_tleImZJuDN_k1KfBYfgVSo9GCWa6QyQCSCgRJteVoVCeLUd81j9PLmiptVBTG5-o5DT8k';

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

function LandingPage({ onSynthesize }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (text.trim().length < 5 || isLoading) return;
    setIsLoading(true);
    onSynthesize(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const loadDemo = () => {
    setText(DEMO_TEXT);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">Taskdumping</div>
          <nav className="landing-nav">
            <a href="#vision">Vision</a>
            <a href="#features">Features</a>
            <a href="#collaboration">Collaboration</a>
            <a href="#documentation">Documentation</a>
          </nav>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="landing-header-cta" onClick={() => document.querySelector('.landing-hero-textarea')?.focus()}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section
          className="landing-hero"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
        >
          <div className="landing-hero-overlay" />
          <div className="landing-hero-content">
            <div className="landing-hero-badge">
              <span className="material-symbols-outlined">sync</span>
              System Online v2.4
            </div>

            <h1>
              Architecting the Future of{' '}
              <span className="landing-gradient-text">Collaboration</span>
            </h1>

            <p className="landing-hero-subtitle">
              A high-fidelity environment engineered for professional teams.
              Seamless structural integrity meets real-time innovation in a
              workspace designed for extreme legibility and speed.
            </p>

            <div className="landing-hero-input-wrap">
              <div className="landing-hero-input-group">
                <textarea
                  className="landing-hero-textarea"
                  placeholder="Dump your tasks here... Describe everything on your mind. We'll organize it into an optimal workflow."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="landing-hero-input-actions">
                  <kbd className="landing-kbd">⌘ Enter</kbd>
                  <button
                    className="landing-submit-btn"
                    onClick={handleSubmit}
                    disabled={text.trim().length < 5}
                    title="Run Neural Synthesis"
                  >
                    <span className="material-symbols-outlined">add_task</span>
                  </button>
                </div>
              </div>
              <div className="landing-hero-hint">
                <span>{text.length} characters</span>
                <span>
                  <button
                    onClick={loadDemo}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--ds-primary)',
                      cursor: 'pointer',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Load Demo
                  </button>
                  {' · '}Ctrl + Enter to submit
                </span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="landing-hero-deco-label">SYS.CORE_REQ_MET</div>
          <div className="landing-hero-deco-bars">
            <span style={{ height: '3rem' }} />
            <span style={{ height: '1rem' }} />
            <span style={{ height: '6rem' }} />
          </div>
        </section>

        {/* Core Pillars Section */}
        <section className="landing-pillars" id="vision">
          <div className="landing-section-inner">
            <div className="landing-section-header">
              <h2>Dumping Architecture</h2>
              <p>
                Built on a foundation of speed and focus, providing the
                definitive environment for offloading tasks and reclaiming
                mental clarity.
              </p>
            </div>

            <div className="landing-pillars-grid">
              {/* Pillar 1 */}
              <div className="glass-panel landing-pillar-card glow-accent">
                <div className="landing-pillar-icon landing-pillar-icon--primary">
                  <span className="material-symbols-outlined" style={{ color: 'var(--ds-primary)', fontSize: '24px' }}>
                    visibility
                  </span>
                </div>
                <h3>Vision</h3>
                <p>
                  Unobtrusive interfaces that guide attention to what matters.
                  Our design philosophy prioritizes clarity over clutter,
                  allowing your content to thrive.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="glass-panel landing-pillar-card glow-accent" id="features">
                <div className="landing-pillar-icon landing-pillar-icon--secondary">
                  <span className="material-symbols-outlined" style={{ color: 'var(--ds-secondary)', fontSize: '24px' }}>
                    architecture
                  </span>
                </div>
                <h3>Features</h3>
                <p>
                  Powerful tools hidden in plain sight. From dynamic gridding
                  to real-time sync states, everything you need is accessible
                  precisely when required.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="glass-panel landing-pillar-card glow-accent" id="collaboration">
                <div className="landing-pillar-icon landing-pillar-icon--tertiary">
                  <span className="material-symbols-outlined" style={{ color: 'var(--ds-tertiary)', fontSize: '24px' }}>
                    group_work
                  </span>
                </div>
                <h3>Collaboration</h3>
                <p>
                  High-fidelity multiplayer environments. Live cursors,
                  contextual tagging, and seamless state management ensure
                  everyone stays aligned.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Effortless Workflow Section */}
        <section className="landing-workflow" id="workflow">
          <div className="landing-section-inner">
            <div className="landing-section-header">
              <h2>Effortless Workflow</h2>
              <p>
                A streamlined process designed to convert chaotic thoughts into
                structured action with minimal friction.
              </p>
            </div>

            <div className="landing-workflow-grid">
              <div className="landing-workflow-line" />

              {/* Step 1 */}
              <div className="landing-workflow-step">
                <div className="landing-workflow-step-icon">
                  <span className="material-symbols-outlined" style={{ color: 'var(--ds-on-surface)', fontSize: '32px' }}>
                    input
                  </span>
                </div>
                <h3>1. Dump</h3>
                <p>
                  Quickly input everything on your mind. No formatting, no
                  structure required. Just let it flow into the system.
                </p>
              </div>

              {/* Step 2 */}
              <div className="landing-workflow-step">
                <div className="landing-workflow-step-icon">
                  <span className="material-symbols-outlined" style={{ color: 'var(--ds-on-surface)', fontSize: '32px' }}>
                    category
                  </span>
                </div>
                <h3>2. Categorize</h3>
                <p>
                  Our AI-driven organization engine automatically sorts, tags,
                  and groups your inputs based on context and priority.
                </p>
              </div>

              {/* Step 3 */}
              <div className="landing-workflow-step">
                <div className="landing-workflow-step-icon">
                  <span className="material-symbols-outlined" style={{ color: 'var(--ds-on-surface)', fontSize: '32px' }}>
                    center_focus_strong
                  </span>
                </div>
                <h3>3. Focus</h3>
                <p>
                  Execute with clarity. Tackle structured lists and organized
                  tasks without the cognitive overhead of managing them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Story Section */}
        <section className="landing-vision" id="documentation">
          <div className="landing-vision-inner">
            <div className="landing-vision-icon">
              <span className="material-symbols-outlined" style={{ color: 'var(--ds-primary)', fontSize: '32px' }}>
                lightbulb
              </span>
            </div>

            <h2>
              The Vision Behind{' '}
              <span className="landing-gradient-text">the Flow</span>
            </h2>

            <div className="landing-vision-body">
              <p>
                Taskdumping was born from the need to solve cognitive overload.
                In a world of constant context switching, we needed a place
                where thoughts can live before they become tasks. It's about
                clearing the mental cache so you can focus on the work that
                actually matters.
              </p>
              <p>
                We believe that productivity isn't just about doing more—it's
                about thinking more clearly. Our platform is engineered to be
                the bridge between inspiration and execution, providing a
                low-friction entry point for the high-fidelity output your
                professional life demands.
              </p>
            </div>

            <div className="landing-vision-divider">
              <span />
            </div>
          </div>

          {/* Decorative glow */}
          <div className="landing-vision-glow-1" />
          <div className="landing-vision-glow-2" />
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-logo">Taskdumping</div>
          <nav className="landing-footer-nav">
            <a href="#">Security</a>
            <a href="#">API</a>
            <a href="#">Status</a>
            <a href="#">Privacy</a>
          </nav>
          <div className="landing-footer-copy">
            © 2024 Taskdumping. HIGH-FIDELITY COLLABORATION.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
