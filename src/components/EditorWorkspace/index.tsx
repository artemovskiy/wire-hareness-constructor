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
import { NodePresenteation, TerminalDef } from '../../app/editor/types';
import { applyNodesPosition, initNodePresentation } from './utils';
import { Net } from '../../core/nets/net';
import { ConnectorNode } from '../ConnectorNode';
import { Connector } from '../../core/harness/connector';
import { Terminal } from '../../core/nets/terminal';

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
    connector: ConnectorNode,
};

export function EditorWorkspace({ selectedNet, onPresentationChange, presentation, design }: EditorWorspaceProps) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const netHarnessNodes = selectedNet?.listInvolvedHarnessNodes() ?? [];
    // console.log(netHarnessNodes)
    // console.log(design.collectNodes().map(n => ({ name: n.name, r: netHarnessNodes.indexOf(n) })))

    const { initialNodes, initialEdges } = useMemo(() => {
        const nodes = design.collectNodes();
        console.log(nodes);
        const initialNodes: Node[] = nodes.map((n, i) => {
            if (n instanceof Connector) {
                const termToNet = new Map<Terminal, Net>();
                const connectorTerminals: Terminal[] = [];
                for (const net of design.nets) {
                    for(const terminal of net.terminals) {
                        if(terminal.attachment === n) {
                            connectorTerminals.push(terminal);
                            termToNet.set(terminal, net);
                        }
                    }
                }
                return {
                    id: n.name,
                    type: 'connector',
                    position: { x: 0, y: 0 },
                    data: {
                        label: !n.descr ? n.name : `${n.name} (${n.descr})`,
                        terminals: connectorTerminals.map(((t, i) => {
                            const net = termToNet.get(t)
                            return {
                                position: i + 1,
                                color: t.wire.color,
                                name: t.name,
                                netName: net?.name,
                             } as TerminalDef;   
                        }))
                    },
                    style: netHarnessNodes.indexOf(n) >= 0 ? { background: "none", boxShadow: "0 0 6px red" } as React.CSSProperties : { background: 'none', },
                }

            } else {
                return {
                    id: n.name,
                    position: { x: 0, y: 0 },
                    data: { label: !n.descr ? n.name : `${n.name} (${n.descr})` },
                    style: netHarnessNodes.indexOf(n) >= 0 ? { background: "none", boxShadow: "0 0 6px red" } as React.CSSProperties : { background: 'none', },
                }
            }
        });
        edgesWithWjs.forEach(e => {
            initialNodes.push({
                id: `${(e.a as HarnessNode).name}-wjs-${(e.b as HarnessNode).name}`,
                position: { x: 0, y: 0 },
                data: { label: "wjs" },
                // TODO: fix it. WJ hareness nodea are never highlighted now
                style: false ? { background: "none", boxShadow: "0 0 6px red" } as React.CSSProperties : { background: 'none', },
            })
        })
        const initialEdges: Edge[] = harenessEdges.filter(e => !edgesWithWjs.has(e)).map((e, i) => ({
            id: `${(e.a as HarnessNode).name}--${(e.b as HarnessNode).name}`,
            source:(e.a as HarnessNode).name,
            target: (e.b as HarnessNode).name,
            label: e.length,
        }));
        edgesWithWjs.forEach(e => {
            initialEdges.push({
                id: `${(e.a as HarnessNode).name}--${(e.a as HarnessNode).name}-wjs-${(e.b as HarnessNode).name}`,
                source: (e.a as HarnessNode).name,
                target: `${(e.a as HarnessNode).name}-wjs-${(e.b as HarnessNode).name}`,
            })
            initialEdges.push({
                id: `${(e.a as HarnessNode).name}-wjs-${(e.b as HarnessNode).name}--${(e.b as HarnessNode).name}`,
                source: `${(e.a as HarnessNode).name}-wjs-${(e.b as HarnessNode).name}`,
                target: (e.b as HarnessNode).name,
            })
        })


        return { initialNodes, initialEdges }
    }, [design, selectedNet])

    useEffect(() => {
        if (!presentation?.length) {
            onPresentationChange(initNodePresentation(initialNodes, initialEdges))
        }
    }, [])

    useEffect(() => {
        if (presentation?.length) {
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