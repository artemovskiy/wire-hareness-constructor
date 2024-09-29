import { Edge } from "../graph/edge";

export class Wire extends Edge {

    color: string;

    constructor(color: string) {
        super()
        this.color = color;
    }
}