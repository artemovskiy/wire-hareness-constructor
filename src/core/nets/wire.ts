import { Edge } from "../graph/edge";
import { Node } from '../graph/node';
import { findPath } from "../graph/path";
import { HarnessEdge } from "../harness/harness-edge";
import { HarnessNode } from "../harness/harness-node";
import { Net } from "./net";
import { Terminal } from "./terminal";
import { WireJoint } from "./wire-joint";

export class Wire extends Edge {

    color: string;

    name: string;

    net: Net;

    constructor(color: string, name: string, net: Net) {
        super()
        this.color = color;
        this.name = name;
        this.net = net;
    }

    // TODO: calculate different cases
    getLength() {
        // строим путь, всегда начиная от терминала
        let start: Terminal;
        let finish: Node;
        if (this.a instanceof Terminal) {
            start = this.a;
            finish = this.b;
        } else if (this.b instanceof Terminal) {
            start = this.b;
            finish = this.a;
        } else {
            console.log(`wire ${this.name} has no terminals, so lenth not calculated`);
            return 0;
        }

        if (finish instanceof Terminal) {
            return this.getPathEdges(start.attachment, finish.attachment).reduce((acc, edge) => acc + edge.length, 0);
        } if (finish instanceof WireJoint) {
            const jounctionEdge = finish.location;
            const path = findPath(start.attachment, jounctionEdge.a);
            if (!path) {
                throw new Error(`Unable to find path for wire ${this.name}`)
            }
            const pathForDebug = [...path]

            const pathEdges: HarnessEdge[] = [];
            let currentNode: HarnessNode = start.attachment;
            let nextNode: HarnessNode = path.shift() as HarnessNode;
            while (nextNode != jounctionEdge.a) {
                nextNode = path.shift() as HarnessNode;
                const edge = currentNode.edges.find(e => e.anotherEndBy(currentNode) === nextNode);
                if (!edge) {
                    throw new Error(`Edge not found for wire ${this.name} currentNode ${currentNode.name} nextNode ${nextNode.name}`);
                }
                const harnessEdge =  edge as HarnessEdge;
                if(harnessEdge.length === undefined) {
                    throw new Error(`Error calc length of wire ${this.name}: edge ${harnessEdge.name} has undefined length`);
                }
                pathEdges.push(harnessEdge)
                currentNode = nextNode;
            }
            const l = pathEdges.reduce((acc, edge) => acc + edge.length, 0);
            if (this.name === 'W2')
                console.log({ l, start, finish, pathForDebug, jounctionEdge, pathEdges });

            if (pathForDebug.includes(jounctionEdge.b)) {
                if (this.name === 'W2')
                console.log('includes');
                // если b входит в path, то от старта до a ближе, чем до b
                // в таком случае из длины вычитаем location и прибавляем длину грани где соединение
                return l - finish.position;
            } else {
                // иначе, от старта до a ближе, чем до b
                // position  считается до a, так что считаем путь до a и прибавляем position
                return l + finish.position;
            }
        } else {
            console.log(`wire ${this.name} ends with a not terminal node, cant canculate`);
            return 0;
        }
    }

    getPathEdges(startNode: HarnessNode, finishNode: HarnessNode): HarnessEdge[] {
        const pathBetween = findPath(startNode, finishNode);
        if (!pathBetween) {
            throw new Error(`Unable to find path for wire ${this.name}`)
        }
        const pathEdges: HarnessEdge[] = [];
        let currentNode: HarnessNode = startNode;
        let nextNode: HarnessNode = pathBetween.shift() as HarnessNode;
        while (nextNode != finishNode) {
            nextNode = pathBetween.shift() as HarnessNode;
            const edge = currentNode.edges.find(e => e.anotherEndBy(currentNode) === nextNode);
            if (!edge) {
                throw new Error(`Edge not found for wire ${this.name} currentNode ${currentNode.name} nextNode ${nextNode.name}`);
            }
            pathEdges.push(edge as HarnessEdge)
            currentNode = nextNode;
        }
        return pathEdges
    }
}