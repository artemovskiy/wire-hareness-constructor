import { Edge } from "../graph/edge";

export class Wire extends Edge {

    color: string;

    name: string;

    constructor(color: string, name: string) {
        super()
        this.color = color;
        this.name = name;
    }
}