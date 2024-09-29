import { Edge } from "../graph/edge";
import { Node } from "../graph/node";
import { HarnessEdge } from "./harness-edge";

export class HarnessNode extends Node {

    connectWith(another: HarnessNode): HarnessEdge {
        return super.connectWith(another) as HarnessEdge;
    }

    descr?: string

}