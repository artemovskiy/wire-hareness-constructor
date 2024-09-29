import React, { useEffect, useMemo } from 'react';
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
    ViewportPortal,
} from '@xyflow/react';

import { useState, useCallback } from 'react';

import WireJointNode from "../wire-joint-node";
import TerminalNode from "../terminal-node";


import '@xyflow/react/dist/style.css';
import { getDesign } from '../../design';
import { HarnessEdge } from '../../core/harness/harness-edge';
import { HarnessNode } from '../../core/harness/harness-node';
import { Design } from '../../design/design';
import { NodePresenteation } from '../../app/editor/types';
import { applyNodesPosition, initNodePresentation } from './utils';
import { Net } from '../../core/nets/net';

const design = getDesign();
const harenessEdges = design.collectEdges();

const edgesWithWjs = new Set<HarnessEdge>();
for (const e of harenessEdges) {
    if (design.wireJoints.some(wj => wj.location === e)) {
        edgesWithWjs.add(e);
    }
}

export interface EditorWorspaceProps {
    design: Design;
    presentation: NodePresenteation[];
    onPresentationChange: (p: NodePresenteation[]) => void;
    selectedNet?: Net;
}

const nodeTypes = {
    wireJoint: WireJointNode,
    terminal: TerminalNode,
};

export function EditorWorkspace({selectedNet, onPresentationChange, presentation, design}: EditorWorspaceProps) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const netHarnessNodes = selectedNet?.listInvolvedHarnessNodes() ?? [];
    console.log(netHarnessNodes)
    console.log(design.collectNodes().map(n => ({ name: n.title, r:  netHarnessNodes.indexOf(n)})))

    const  { initialNodes, initialEdges } = useMemo(() => {
        const initialNodes: Node[] = design.collectNodes().map((n, i) => ({
            id: n.title,
            position: { x: 0, y: 0 },
            data: { label: !n.descr ? n.title : `${n.title} (${n.descr})` },
            style: netHarnessNodes.indexOf(n) >= 0 ? { background: "none", boxShadow: "0 0 6px red" } as React.CSSProperties : { background: 'none', },
        }));
        edgesWithWjs.forEach(e => {
            initialNodes.push({
                id: `${e.a.title}-wjs-${e.b.title}`,
                position: { x: 0, y: 0 },
                data: { label: "wjs" },
                style: netHarnessNodes.indexOf(e.a as HarnessNode) >= 0 ? { background: "none", boxShadow: "0 0 6px red" } as React.CSSProperties : { background: 'none', },
            })
        })
        const initialEdges: Edge[] = harenessEdges.filter(e => !edgesWithWjs.has(e)).map((e, i) => ({
            id: `${e.a.title}--${e.b.title}`,
            source: e.a.title,
            target: e.b.title,
            label: e.length,
        }));
        edgesWithWjs.forEach(e => {
            initialEdges.push({
                id: `${e.a.title}--${e.a.title}-wjs-${e.b.title}`,
                source: e.a.title,
                target: `${e.a.title}-wjs-${e.b.title}`,
            })
            initialEdges.push({
                id: `${e.a.title}-wjs-${e.b.title}--${e.b.title}`,
                source: `${e.a.title}-wjs-${e.b.title}`,
                target: e.b.title,
            })
        })


        return {initialNodes, initialEdges}
    }, [design, selectedNet])

    useEffect(() => {
        if(!presentation?.length) {
            onPresentationChange(initNodePresentation(initialNodes, initialEdges))
        }
    }, [])

    useEffect(() => {
        if(presentation?.length) {
            setNodes(applyNodesPosition(initialNodes, presentation));
            setEdges(initialEdges);
        }
    }, [presentation, initialNodes, initialEdges]);

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