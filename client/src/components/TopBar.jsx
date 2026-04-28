import { useCallback } from 'react';
import { toPng } from 'html-to-image';
import './TopBar.css';

function TopBar({ nodes, onExecuteAll, onReset, onToggleTerminal, showTerminal }) {
  const handleExportPng = useCallback(async () => {
    const flowElement = document.querySelector('.react-flow');
    if (!flowElement) return;

    try {
      const dataUrl = await toPng(flowElement, {
        backgroundColor: '#000000',
        filter: (node) => !node.classList?.contains('react-flow__minimap')
      });

      const link = document.createElement('a');
      link.download = 'taskdumping-workflow.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, []);

  const handleCopyMarkdown = useCallback(() => {
    const taskNodes = nodes.filter(n => n.type === 'task');
    const completed = taskNodes.filter(n => n.data.state === 'complete').length;

    let md = `# TaskDumping — Task Sequence\n\n`;
    md += `**Progress:** ${completed}/${taskNodes.length} complete\n\n`;

    taskNodes.forEach(node => {
      const checkbox = node.data.state === 'complete' ? '[x]' : '[ ]';
      const priority = node.data.priority?.toUpperCase() || 'MEDIUM';
      md += `- ${checkbox} **${node.data.label}** [${priority}]\n`;
      if (node.data.desc) {
        md += `  - ${node.data.desc}\n`;
      }
    });

    navigator.clipboard.writeText(md);
  }, [nodes]);

  return (
    <div className="topbar glass">
      <div className="topbar-left">
        <div className="topbar-logo">
          <svg viewBox="0 0 24 24" className="logo-icon">
            <circle cx="12" cy="12" r="10" fill="none" stroke="url(#topbarGrad)" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="url(#topbarGrad)" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="1" fill="url(#topbarGrad)" />
            <defs>
              <linearGradient id="topbarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--cyan)" />
                <stop offset="100%" stopColor="var(--purple)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="topbar-title">TaskDumping</span>
        </div>
      </div>

      <div className="topbar-center">
        <div className="topbar-status">
          <span className="status-dot"></span>
          <span>Neural Core Online</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="btn-ghost" onClick={handleExportPng}>
          Export PNG
        </button>
        <button className="btn-ghost" onClick={handleCopyMarkdown}>
          Copy Markdown
        </button>
        <button className="btn-primary" onClick={onExecuteAll}>
          Execute All
        </button>
        <button className="btn-ghost" onClick={onReset}>
          New Flow
        </button>
        <button
          className={`btn-ghost ${showTerminal ? 'active' : ''}`}
          onClick={onToggleTerminal}
        >
          Terminal
        </button>
      </div>
    </div>
  );
}

export default TopBar;