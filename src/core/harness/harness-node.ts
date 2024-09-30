import { Edge } from "../graph/edge";
import { Node } from "../graph/node";
import { HarnessEdge } from "./harness-edge";

export class HarnessNode extends Node {

    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    connectWith(another: HarnessNode): HarnessEdge {
        return super.connectWith(another) as HarnessEdge;
    }

    descr?: string

}