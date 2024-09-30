import { Connector } from "../harness/connector";
import { Wire } from "./wire";
import { WireNode } from "./wire-node";

export class Terminal extends WireNode {
    attachment: Connector;


    set wire(wire: Wire) {
        if(!this.edges) {
            this.edges = [];
        }
        this.edges[0] = wire;
    }

    get wire(): Wire {
        return this.edges[0] as Wire;
    }

    constructor(name: string, attachment: Connector) {
        super(name);
        this.attachment = attachment;
    }


}