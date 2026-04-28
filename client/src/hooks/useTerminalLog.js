import { useState, useCallback } from 'react';

export function useTerminalLog() {
  const [entries, setEntries] = useState([]);

  const addLog = useCallback((text, type = 'info') => {
    const entry = {
      id: Date.now() + Math.random(),
      text,
      type,
      timestamp: Date.now()
    };
    setEntries(prev => [...prev, entry]);
  }, []);

  const clearLog = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addLog, clearLog };
}