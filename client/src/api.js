const API_BASE = '/api';

export async function synthesize(text) {
  const res = await fetch(`${API_BASE}/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Synthesis failed');
  }
  return res.json();
}

export async function getSubtasks(taskLabel, taskDesc) {
  const res = await fetch(`${API_BASE}/subtasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskLabel, taskDesc })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Subtask generation failed');
  }
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}