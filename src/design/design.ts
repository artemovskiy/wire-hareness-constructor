import { getNodes, walkOverNodes } from "../core/graph/walk";
import { Connector } from "../core/harness/connector";
import { Fork } from "../core/harness/fork";
import { HarnessEdge } from "../core/harness/harness-edge";
import { HarnessNode } from "../core/harness/harness-node";
import { Net } from "../core/nets/net";
import { Terminal } from "../core/nets/terminal";
import { WireJoint } from "../core/nets/wire-joint";
import { NameAssginer } from "./name-assigner";

export class Design {
    root: HarnessNode;

    nameAssginer = new NameAssginer();

    nets: Net[] = [];

    constructor(root: HarnessNode) {
        this.root = root;
        console.log(getNodes(root));
    }

    collectNodes(): HarnessNode[] {
        return getNodes(this.root) as HarnessNode[];
    }

    collectEdges(): HarnessEdge[] {
        const edges = new Set<HarnessEdge>();
        walkOverNodes(this.root, (node) => {
            node.edges.map(e => edges.add(e as HarnessEdge));
        });
        return Array.from(edges.values());
    }

    wireJoints: WireJoint[] = [];

    createWireJoint(net: Net, name: string): WireJoint {
        const wj = new WireJoint();
        wj.title = name;
        this.wireJoints.push(wj)
        return wj;
    }

    createTerminal(name: string, net: Net, attachment: Connector): Terminal {
        const terminal = new Terminal(attachment);
        net.terminals.push();
        return terminal;
    }

    createFork(): Fork {
        const name = this.nameAssginer.getName(Fork);
        return Fork.withTitle(name) as Fork;
    }
}