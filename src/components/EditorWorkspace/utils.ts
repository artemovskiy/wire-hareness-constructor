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

export const buildNetNodesEdges = (net: Net) => {
    const netNodes: Node[] = [];
    const netsEdges: Edge[] = [];
    const netEdges: Set<Wire> = new Set();
    walkOverNodes(net.root as WireNode, node => {
        if (node instanceof Terminal) {
            netNodes.push({
                id: node.title,
                position: { x: 0, y: 0 },
                data: { label: node.title },
                parentId: node.attachment.title,
                type: 'terminal',
            })
        } else {
            const wj = node as WireJoint;
            let parentId: undefined | string = undefined;
            if (wj.location) {
                parentId = `${wj.location.a.title}-wjs-${wj.location.b.title}`;
            }
            netNodes.push({
                id: node.title,
                position: { x: 0, y: 0 },
                data: { label: node.title },
                type: node instanceof WireJoint ? 'wireJoint' : undefined,
                parentId,
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