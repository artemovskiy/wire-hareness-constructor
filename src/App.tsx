import React, { useEffect } from 'react';
import {
  ReactFlow, applyEdgeChanges, applyNodeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  Background,
  Controls,
  addEdge,
  Connection,
  Position,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';

import { useState, useCallback } from 'react';

import WireJointNode from "./components/wire-joint-node";
import TerminalNode from "./components/terminal-node";


import '@xyflow/react/dist/style.css';
import { getDesign } from './design';
import { walkOverNodes } from './core/graph/walk';
import { WireNode } from './core/nets/wire-node';
import { Wire } from './core/nets/wire';
import { WireJoint } from './core/nets/wire-joint';
import { Terminal } from './core/nets/terminal';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes: Node[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: (isHorizontal ? 'left' : 'top') as Position,
      sourcePosition: (isHorizontal ? 'right' : 'bottom') as Position,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};


const design = getDesign();

const initialNodes = design.collectNodes().map((n, i) => ({
  id: n.title,
  position: { x: 0, y: 0 },
  data: { label: !n.descr ? n.title : `${n.title} (${n.descr})` },
  style: { background: 'none', },
}));
const initialEdges: Edge[] = design.collectEdges().map((e, i) => ({
  id: `${e.a.title}--${e.b.title}`,
  source: e.a.title,
  target: e.b.title,
  label: e.length,
}));


const nodeTypes = {
  wireJoint: WireJointNode,
  terminal: TerminalNode,
};


function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      getLayoutedElements(nodes, edges, "LR");

    let netsNodes: Node[] = [];
    const netsEdges: Edge[] = [];

    for (let i = 0; i < design.nets.length; i++) {
      const net = design.nets[i];
      const netNodes: Node[] = [];
      const netEdges: Set<Wire> = new Set();
      walkOverNodes(net.root as WireNode, node => {
        if (node instanceof Terminal) {
          netNodes.push({
            id: node.title,
            //position: { x: netNodes.length * 200, y: i * -100 },
            position: {x: 0, y: 0},
            data: { label: node.title },
            parentId: node.attachment.title,
            type: 'terminal',
          })
        } else {
          netNodes.push({
            id: node.title,
            position: { x: netNodes.length * 200, y: i * -100 },
            data: { label: node.title },
            type: node instanceof WireJoint ? 'wireJoint' : undefined,
          })
        }

        node.edges.forEach(e => {
          if (netEdges.has(e as Wire)) {
            return
          }
          netEdges.add(e as Wire);
          netsEdges.push({
            id: `${e.a.title}--${e.b.title}`,
            source: e.a.title,
            target: e.b.title,
            style: {
              stroke: (e as Wire).color,
            }
          })
        })
      })
      netsNodes = [...netsNodes, ...netNodes];
    }

    setNodes([...layoutedNodes, ...netsNodes]);
    setEdges([...layoutedEdges, ...netsEdges]);
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}

        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
