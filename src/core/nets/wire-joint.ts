import { HarnessEdge } from "../harness/harness-edge";
import { Wire } from "./wire";
import { WireNode } from "./wire-node";

export class WireJoint extends WireNode {
    location: HarnessEdge;

    position: number;

    constructor(name: string, location: HarnessEdge, position: number) {
        super(name);
        this.location = location;
        this.position = position;
    }
}