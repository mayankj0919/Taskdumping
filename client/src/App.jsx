import { useState, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import BrainDumpOverlay from './components/BrainDumpOverlay';
import ProcessingOverlay from './components/ProcessingOverlay';
import WorkflowCanvas from './components/WorkflowCanvas';
import TopBar from './components/TopBar';
import InspectPanel from './components/InspectPanel';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import { synthesize, getSubtasks } from './api';
import { useTerminalLog } from './hooks/useTerminalLog';

let taskIdCounter = 0;
let subtaskIdCounter = 0;

function App() {
  const [phase, setPhase] = useState('idle');
  const [tasks, setTasks] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [toasts, setToasts] = useState([]);
  const { entries, addLog, clearLog } = useTerminalLog();

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const buildFlowData = useCallback((taskList) => {
    const newNodes = [];
    const newEdges = [];
    const spacingX = 300;
    const spacingY = 120;

    newNodes.push({
      id: 'core',
      type: 'core',
      position: { x: 50, y: 200 },
      data: { label: 'Neural Core', state: 'running' }
    });

    taskList.forEach((task, index) => {
      newNodes.push({
        id: task.id,
        type: 'task',
        position: { x: 150 + (index % 3) * spacingX, y: 50 + index * spacingY },
        data: {
          ...task,
          state: 'pending',
          index: index + 1
        }
      });

      if (task.deps && task.deps.length > 0) {
        task.deps.forEach(depId => {
          newEdges.push({
            id: `e-${depId}-${task.id}`,
            source: depId,
            target: task.id,
            type: 'neon',
            data: { color: 'cyan' }
          });
        });
      } else {
        newEdges.push({
          id: `e-core-${task.id}`,
          source: 'core',
          target: task.id,
          type: 'neon',
          data: { color: 'purple' }
        });
      }
    });

    return { nodes: newNodes, edges: newEdges };
  }, []);

  const handleSynthesize = useCallback(async (text) => {
    setPhase('processing');
    addLog('Initializing neural synthesis...', 'system');

    setTimeout(async () => {
      try {
        addLog('Analyzing brain dump...', 'info');
        const result = await synthesize(text);
        addLog(`Received ${result.tasks.length} tasks from ${result.provider}`, 'success');

        const { nodes: newNodes, edges: newEdges } = buildFlowData(result.tasks);
        setTasks(result.tasks);
        setNodes(newNodes);
        setEdges(newEdges);

        addLog('Building execution graph...', 'info');
        addLog('Neural synthesis complete!', 'success');
        addLog(`Graph contains ${newNodes.length - 1} tasks`, 'info');

        setTimeout(() => {
          setPhase('workflow');
          addToast('Workflow created successfully!', 'success');
        }, 1500);
      } catch (err) {
        addLog(`Error: ${err.message}`, 'error');
        addToast(err.message, 'error');
        setPhase('idle');
      }
    }, 500);
  }, [addLog, addToast, buildFlowData]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleCloseInspect = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleMarkComplete = useCallback((nodeId) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const newState = n.data.state === 'complete' ? 'pending' : 'complete';
        addLog(`Task "${n.data.label}" marked as ${newState}`, newState === 'complete' ? 'success' : 'info');
        return { ...n, data: { ...n.data, state: newState } };
      }
      return n;
    }));
  }, [addLog]);

  const handleDeepDive = useCallback(async (parentId) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    addLog(`Breaking down task "${parentNode.data.label}"...`, 'info');

    try {
      const result = await getSubtasks(parentNode.data.label, parentNode.data.desc);
      const subtasks = result.subtasks.map((st, i) => ({
        ...st,
        id: `sub-${subtaskIdCounter++}-${parentId}`,
        deps: [parentId]
      }));

      const parentIndex = nodes.findIndex(n => n.id === parentId);
      const newNodes = [...nodes];
      const newEdges = [...edges];

      subtasks.forEach((st, i) => {
        newNodes.push({
          id: st.id,
          type: 'task',
          position: {
            x: parentNode.position.x + 350,
            y: parentNode.position.y + (i - 1) * 120
          },
          data: { ...st, state: 'pending', index: subtaskIdCounter }
        });
        newEdges.push({
          id: `e-${parentId}-${st.id}`,
          source: parentId,
          target: st.id,
          type: 'neon',
          data: { color: 'cyan' }
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
      addLog(`Added ${subtasks.length} subtasks`, 'success');
      addToast('Subtasks added to graph', 'success');
    } catch (err) {
      addLog(`Error: ${err.message}`, 'error');
      addToast(err.message, 'error');
    }
  }, [nodes, edges, addLog, addToast]);

  const handleExecuteAll = useCallback(async () => {
    const taskNodes = nodes.filter(n => n.type === 'task' && n.data.state !== 'complete');
    addLog(`Executing all ${taskNodes.length} tasks...`, 'system');

    for (const node of taskNodes) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setNodes(prev => prev.map(n => {
        if (n.id === node.id) {
          addLog(`Completed: ${n.data.label}`, 'success');
          return { ...n, data: { ...n.data, state: 'complete' } };
        }
        return n;
      }));
    }
    addLog('All tasks executed!', 'success');
    addToast('All tasks completed!', 'success');
  }, [nodes, addLog, addToast]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setTasks([]);
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    clearLog();
    taskIdCounter = 0;
    subtaskIdCounter = 0;
    addLog('System reset. Ready for new brain dump.', 'system');
  }, [clearLog, addLog]);

  return (
    <ReactFlowProvider>
      <div className="app-container">
        {phase === 'idle' && (
          <BrainDumpOverlay onSynthesize={handleSynthesize} />
        )}

        {phase === 'processing' && <ProcessingOverlay />}

        {phase === 'workflow' && (
          <>
            <TopBar
              nodes={nodes}
              onExecuteAll={handleExecuteAll}
              onReset={handleReset}
              onToggleTerminal={() => setShowTerminal(!showTerminal)}
              showTerminal={showTerminal}
            />
            <div className="workflow-wrapper">
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodeClick={handleNodeClick}
              />
              {showTerminal && <Sidebar entries={entries} onClose={() => setShowTerminal(false)} />}
            </div>
            {selectedNode && (
              <InspectPanel
                node={selectedNode}
                onClose={handleCloseInspect}
                onMarkComplete={handleMarkComplete}
                onDeepDive={handleDeepDive}
              />
            )}
          </>
        )}

        <div className="toast-container">
          {toasts.map(toast => (
            <Toast key={toast.id} message={toast.message} type={toast.type} />
          ))}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;