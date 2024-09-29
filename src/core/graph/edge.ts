import { Node } from "./node"

export class Edge {
    a: Node = new Node();
    b: Node = new Node();

    anotherEndBy(node: Node) {
        if(node === this.a) {
            return this.b;
        }
        if(node === this.b) {
            return this.a;
        }
        throw new Error("The node is not an end of the edge");
    }
}