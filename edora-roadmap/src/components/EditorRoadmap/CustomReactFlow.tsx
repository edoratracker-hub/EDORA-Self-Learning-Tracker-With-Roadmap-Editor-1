import { useMemo } from 'react';
import { ReactFlow, Handle, Position, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/**
 * Check whether a colour string is "white-ish" (transparent, white, near-white)
 * so we can swap it out for the dark-theme equivalent.
 */
function isWhiteish(color?: string): boolean {
  if (!color) return true;
  const c = color.trim().toLowerCase();
  return (
    c === '' ||
    c === 'white' ||
    c === 'white ' ||
    c === 'white\n' ||
    c === 'transparent' ||
    c === '#fff' ||
    c === '#ffff' ||
    c === '#ffffff' ||
    c === 'rgb(255,255,255)' ||
    c === 'rgb(255, 255, 255)' ||
    c === 'rgba(255,255,255,1)' ||
    c === 'rgba(255, 255, 255, 1)'
  );
}

/**
 * Check whether a colour string is "black-ish" so we can lighten it for dark bg.
 */
function isBlackish(color?: string): boolean {
  if (!color) return false;
  const c = color.trim().toLowerCase();
  return (
    c === '#000' ||
    c === '#000000' ||
    c === 'black' ||
    c === 'rgb(0,0,0)' ||
    c === 'rgb(0, 0, 0)'
  );
}

// Generic custom node to handle roadmap topics, subtopics, etc.
const RoadmapNode = ({ data, id, type }: any) => {
  const style = data?.style || {};
  const label = data?.label || '';
  // Use dimensions from data (injected during mapping) or fall back to auto
  const nodeWidth = data?._width;
  const nodeHeight = data?._height;

  // Adapt colours for the dark theme
  let bgColor = style?.backgroundColor || 'transparent';
  if (isWhiteish(bgColor)) {
    bgColor = 'transparent'; // Let the dark page gradient show through
  }

  let borderCol = style?.borderColor || 'transparent';
  if (isBlackish(borderCol)) {
    borderCol = 'rgba(148, 163, 184, 0.5)'; // slate-400/50 — visible on dark bg
  } else if (isWhiteish(borderCol)) {
    borderCol = 'transparent';
  }

  // Clean up styles that might be incompatible or misshaped
  const internalStyle: React.CSSProperties = {
    width: nodeWidth || 'auto',
    height: nodeHeight || 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: style?.justifyContent || 'center',
    textAlign: (style?.textAlign || 'center') as any,
    backgroundColor: bgColor,
    borderStyle: 'solid',
    borderWidth: type === 'vertical' || type === 'horizontal' ? 0 : (style?.borderWidth || 2),
    borderColor: borderCol,
    color: '#fff',
    position: 'relative',
    borderRadius: type === 'title' ? '8px' : '4px',
    boxSizing: 'border-box',
    padding: '0 8px',
    fontSize: `${style?.fontSize || 14}px`,
  };

  if (type === 'vertical') {
    let strokeColor = style.stroke || '#94a3b8';
    if (isBlackish(strokeColor)) strokeColor = '#94a3b8'; // slate-400
    Object.assign(internalStyle, {
      borderLeftWidth: parseFloat(style.strokeWidth || 2),
      borderLeftStyle: style.strokeDasharray ? 'dashed' : 'solid',
      borderLeftColor: strokeColor,
      width: 0,
    });
  } else if (type === 'horizontal') {
    let strokeColor = style.stroke || '#94a3b8';
    if (isBlackish(strokeColor)) strokeColor = '#94a3b8';
    Object.assign(internalStyle, {
      borderTopWidth: parseFloat(style.strokeWidth || 2),
      borderTopStyle: style.strokeDasharray ? 'dashed' : 'solid',
      borderTopColor: strokeColor,
      height: 0,
    });
  }

  return (
    <div
      style={internalStyle}
      className={`roadmap-node roadmap-node-${type}`}
      data-node-id={id}
      data-type={type}
      data-title={label}
    >
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="right" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />

      <Handle type="source" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} id="top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />

      {type !== 'vertical' && type !== 'horizontal' && (
        <span style={{ width: '100%' }}>{label}</span>
      )}
    </div>
  );
};

const nodeTypes = {
  paragraph: RoadmapNode,
  vertical: RoadmapNode,
  title: RoadmapNode,
  topic: RoadmapNode,
  subtopic: RoadmapNode,
  section: RoadmapNode,
  horizontal: RoadmapNode,
  button: RoadmapNode,
  'link-item': RoadmapNode,
  resourceButton: RoadmapNode,
  todo: RoadmapNode,
  'todo-checkbox': RoadmapNode,
  'checklist-item': RoadmapNode,
  label: RoadmapNode,
};

export const CustomReactFlow = ({ nodes, edges, dimensions }: any) => {
  const mappedNodes = useMemo(() => {
    return (nodes || []).map((node: any) => {
      // Extract dimensions: prefer measured > style > top-level width/height
      const w = node.measured?.width || node.style?.width || node.width;
      const h = node.measured?.height || node.style?.height || node.height;

      return {
        ...node,
        type: nodeTypes[node.type as keyof typeof nodeTypes] ? node.type : 'paragraph',
        position: node.position || {
          x: node.positionAbsolute?.x || 0,
          y: node.positionAbsolute?.y || 0,
        },
        // React Flow uses `style` on the wrapper to set the node dimensions
        style: {
          ...node.style,
          width: w,
          height: h,
        },
        // Pass width/height into data so our custom component can use them
        data: {
          ...node.data,
          _width: w,
          _height: h,
        },
      };
    });
  }, [nodes]);

  const mappedEdges = useMemo(() => {
    return (edges || []).map((edge: any) => {
      // Lighten black/dark edge strokes for dark background
      let stroke = edge.style?.stroke;
      if (isBlackish(stroke)) {
        stroke = '#94a3b8'; // slate-400
      }
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: stroke || '#94a3b8',
          strokeWidth: edge.style?.strokeWidth || 2,
        },
      };
    });
  }, [edges]);

  // If there are no nodes at all yet, show nothing
  if (!nodes || nodes.length === 0) return null;

  return (
    <div
      className="custom-reactflow-dark"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '85vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ReactFlow
        nodes={mappedNodes}
        edges={mappedEdges}
        nodeTypes={nodeTypes as any}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        minZoom={0.1}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
