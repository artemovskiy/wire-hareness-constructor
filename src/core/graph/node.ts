import { Edge } from "./edge";

export class Node {
    edges: Edge[] = [];

    title: string = "";

    static withTitle(title: string): Node {
        const n = new this;
        n.title = title;
        return n;
    }

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