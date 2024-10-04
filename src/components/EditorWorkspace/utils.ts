import { Edge, Node, Position, XYPosition } from "@xyflow/react";
import { walkOverNodes } from "../../core/graph/walk";
import { Net } from "../../core/nets/net";
import { Wire } from "../../core/nets/wire";
import { WireJoint } from "../../core/nets/wire-joint";
import { WireNode } from "../../core/nets/wire-node";
import { Terminal } from "../../core/nets/terminal";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import { NodePresenteation } from "../../app/editor/types";
import dagre from '@dagrejs/dagre';
import { HarnessNode } from "../../core/harness/harness-node";
import { HarnessEdge } from "../../core/harness/harness-edge";

export const buildNetNodesEdges = (net: Net) => {
    const netNodes: Node[] = [];
    const netsEdges: Edge[] = [];
    const netEdges: Set<Wire> = new Set();
    walkOverNodes(net.root as WireNode, node => {
        if (node instanceof Terminal) {
            netNodes.push({
                id: node.name,
                position: { x: 0, y: 0 },
                data: { label: node.name },
                parentId: node.attachment.connector.name,
                type: 'terminal',
            })
        } else {
            const wj = node as WireJoint;
            let parentId: undefined | string = undefined;
            if (wj.location) {
                parentId = `${(wj.location.a as HarnessNode).name}-wjs-${(wj.location.b as HarnessNode).name}`;
            }
            netNodes.push({
                id: wj.name,
                position: { x: 0, y: 0 },
                data: { label: wj.name },
                type: node instanceof WireJoint ? 'wireJoint' : undefined,
                parentId,
            })
        }

        node.edges.forEach(e => {
            const wire = e as Wire;
            if (netEdges.has(wire)) {
                return
            }
            netEdges.add(e as Wire);
            netsEdges.push({
                id: `${(wire.a as WireNode).name}--${(wire.b as WireNode).name}`,
                source: (wire.a as WireNode).name,
                target: (wire.b as WireNode).name,
                style: {
                    stroke: (e as Wire).color,
                }
            })
        })
    })
    return { nodes: netNodes, edges: netsEdges }
}

export const initNodePresentation = (nodes: Node[], edges: Edge[]): NodePresenteation[] => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode: NodePresenteation = {
            nodeId: node.id,
            position: {
                x: nodeWithPosition.x - NODE_WIDTH / 2,
                y: nodeWithPosition.y - NODE_HEIGHT / 2,
            },
        };

        return newNode;
    });
};

export const applyNodesPosition = (nodes: Node[], presentations: NodePresenteation[]) => {
    return nodes.map((node) => {
        const nodePresent = presentations.find(p => p.nodeId === node.id);
        if (!nodePresent) {
            throw new Error("no node present give for node " + node.id)
        }
        const nodeWithPosition = nodePresent.position;
        const newNode: Node = {
            ...node,
            targetPosition: 'left' as Position,
            sourcePosition: 'right' as Position,
            position: {
                x: nodeWithPosition.x - NODE_WIDTH / 2,
                y: nodeWithPosition.y - NODE_HEIGHT / 2,
            },
        };

        return newNode;
    });
}