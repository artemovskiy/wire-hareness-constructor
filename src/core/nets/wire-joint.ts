import { HarnessEdge } from "../harness/harness-edge";
import { Wire } from "./wire";
import { WireNode } from "./wire-node";

export class WireJoint extends WireNode {
    location?: HarnessEdge;

    constructor(wires: Wire[]) {
        super();
        this.edges = wires;
    }
}