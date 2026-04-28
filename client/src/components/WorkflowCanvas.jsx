import { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CoreNode from '../nodes/CoreNode';
import TaskNode from '../nodes/TaskNode';
import NeonEdge from '../edges/NeonEdge';
import './WorkflowCanvas.css';

const nodeTypes = {
  core: CoreNode,
  task: TaskNode
};

const edgeTypes = {
  neon: NeonEdge
};

const defaultEdgeOptions = {
  type: 'neon',
  animated: true
};

function WorkflowCanvas({ nodes: initialNodes, edges: initialEdges, onNodeClick }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback((event, node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  return (
    <div className="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color="rgba(255,255,255,0.05)" gap={24} size={1} />
        <Controls className="workflow-controls" />
        <MiniMap
          className="workflow-minimap"
          nodeColor={(node) => {
            if (node.type === 'core') return 'var(--purple)';
            const state = node.data?.state;
            if (state === 'complete') return 'var(--green)';
            return 'var(--cyan)';
          }}
          maskColor="rgba(0,0,0,0.5)"
        />
      </ReactFlow>
    </div>
  );
}

export default WorkflowCanvas;