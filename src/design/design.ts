import { getNodes, walkOverNodes } from "../core/graph/walk";
import { Connector } from "../core/harness/connector";
import { Fork } from "../core/harness/fork";
import { HarnessEdge } from "../core/harness/harness-edge";
import { HarnessNode } from "../core/harness/harness-node";
import { Net } from "../core/nets/net";
import { Terminal } from "../core/nets/terminal";
import { WireJoint } from "../core/nets/wire-joint";
import { ElementFactory } from "./element-factory";
import { ElementsCollection } from "./elements-collection";
import { NameAssginer } from "./name-assigner";

export class Design {
    get root(): HarnessNode {
        const connectors = this.elementsCollection.all<Connector>(Connector);
        return connectors[0];
    };

    public readonly elementsCollection = new ElementsCollection();
    private readonly nameAssginer = new NameAssginer();

    public readonly elementsFactory: ElementFactory;

    constructor() {
        this.elementsFactory = new ElementFactory(this.elementsCollection, this.nameAssginer);
    }

    get nets(): Net[] {
        return this.elementsCollection.all<Net>(Net) as Net[];
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

    get wireJoints(): WireJoint[]{
        return this.elementsCollection.all(WireJoint) as WireJoint[];
    }
}