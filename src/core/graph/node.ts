import { Edge } from "./edge";

export class Node {
    edges: Edge[] = [];

    connectWith(another: Node): Edge {
        // TODO: check for already existent connections
        const edge = new Edge();

        another.edges.push(edge);
        edge.a = another;

        this.edges.push(edge);
        edge.b = this;

        return edge;
    }
}