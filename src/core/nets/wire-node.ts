import { Node } from "../graph/node";

export class WireNode extends Node {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}