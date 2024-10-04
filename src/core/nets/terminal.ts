import { Connector } from "../harness/connector";
import { TerminalAttachment } from "./terminal-attachment";
import { Wire } from "./wire";
import { WireNode } from "./wire-node";

export class Terminal extends WireNode {

    set wire(wire: Wire) {
        if (!this.edges) {
            this.edges = [];
        }
        this.edges[0] = wire;
    }

    get wire(): Wire {
        return this.edges[0] as Wire;
    }

    constructor(name: string, public readonly attachment: TerminalAttachment) {
        super(name);
    }

}