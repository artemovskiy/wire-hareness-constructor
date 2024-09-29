import { Edge } from "@xyflow/react";
import {Node} from "./node";

export const walkOverNodes = (from: Node, cb: (node: Node) => void) => {

    const gone = new Set<Node>();
    function walkOverSiblings(n: Node) {
        if(gone.has(n)) { 
            return;
        }
        gone.add(n);
        cb(n);
        n.edges.map(e => walkOverSiblings(e.anotherEndBy(n)));
    }
    walkOverSiblings(from);
}

export const getNodes = (from: Node): Node[] => {
    const gone = new Set<Node>();
    function walkOverSiblings(n: Node) {
        if(gone.has(n)) { 
            return;
        }
        gone.add(n);
        n.edges.map(e => walkOverSiblings(e.anotherEndBy(n)));
    }
    walkOverSiblings(from);
    return Array.from(gone.values());
}
