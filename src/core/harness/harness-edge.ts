import { Edge } from "../graph/edge";

export class HarnessEdge extends Edge {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
    length: number = 0;
}