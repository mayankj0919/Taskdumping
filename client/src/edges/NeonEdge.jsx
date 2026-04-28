import { BaseEdge, getBezierPath } from '@xyflow/react';
import './NeonEdge.css';

function NeonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const color = data?.color || 'cyan';

  return (
    <g className={`neon-edge ${color}`}>
      <BaseEdge
        id={id}
        path={edgePath}
        style={style}
        markerEnd={markerEnd}
        className="neon-edge-base"
      />
    </g>
  );
}

export default NeonEdge;