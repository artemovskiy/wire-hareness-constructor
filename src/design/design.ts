import { getNodes, walkOverNodes } from "../core/graph/walk";
import { Fork } from "../core/harness/fork";
import { HarnessEdge } from "../core/harness/harness-edge";
import { HarnessNode } from "../core/harness/harness-node";
import { Net } from "../core/nets/net";
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

    createFork(): Fork {
        const name = this.nameAssginer.getName(Fork);
        return Fork.withTitle(name) as Fork;
    }
}