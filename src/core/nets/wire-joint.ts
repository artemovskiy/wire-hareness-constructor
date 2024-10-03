import { HarnessEdge } from "../harness/harness-edge";
import { Net } from "./net";
import { Wire } from "./wire";
import { WireNode } from "./wire-node";

export class WireJoint extends WireNode {
    location: HarnessEdge;

    position: number;

    net: Net;
    constructor(name: string, location: HarnessEdge, position: number, net: Net) {
        super(name);
        this.location = location;
        this.position = position;
        this.net = net;
    }
}