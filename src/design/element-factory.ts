import { Terminal } from "../core/nets/terminal";
import { WireJoint } from "../core/nets/wire-joint";
import { Connector } from "../core/harness/connector";
import { Fork } from "../core/harness/fork";
import { HarnessEdge } from "../core/harness/harness-edge";
import { ElementsCollection } from "./elements-collection";
import { NameAssginer } from "./name-assigner";
import { Wire } from "../core/nets/wire";
import { Net } from "../core/nets/net";
import { WireNode } from "../core/nets/wire-node";
import { TerminalAttachment } from "../core/nets/terminal-attachment";

export interface BaseElementParam {
    name?: string;
    description?: string;
}

export interface ConnectorParams extends BaseElementParam {
    maxPinsQty: number;
}

export interface ForkParams extends BaseElementParam { }

export interface EdgeParams extends BaseElementParam {
    length: number;
}

export interface TerminalParams extends BaseElementParam {
    connector: Connector;
    pin: number;
    net: Net;
}

export interface WireJunctionParams extends BaseElementParam {
    location: HarnessEdge;
    position: number;
    net: Net;
}

export interface WireParams extends BaseElementParam {
    color: string;
    net: Net;
    crossSectionArea: number;

    from?: WireNode;
    to?: WireNode;
}

export interface NetParams extends BaseElementParam { }

export class ElementFactory {

    constructor(
        private readonly elementsCollection: ElementsCollection,
        private readonly nameAssginer: NameAssginer,
    ) {

    }

    createConnector(params: ConnectorParams): Connector {
        const name = params.name ?? this.nameAssginer.createNameFor(Connector);
        const connector = new Connector(name, params.maxPinsQty);
        this.elementsCollection.put(Connector, connector);
        return connector;
    }

    createFork(params: ForkParams): Fork {
        const name = params.name ?? this.nameAssginer.createNameFor(Fork);
        const fork = new Fork(name);
        this.elementsCollection.put(Fork, fork);
        return fork;

    }

    createEdge(params: EdgeParams): HarnessEdge {
        const name = params.name ?? this.nameAssginer.createNameFor(HarnessEdge);
        const el = new HarnessEdge(name);
        this.elementsCollection.put(HarnessEdge, el);
        return el;
    }

    createTerminal(params: TerminalParams): Terminal {
        const name = params.name ?? this.nameAssginer.createNameFor(Terminal);

        const attachment = new TerminalAttachment(params.connector, params.pin);
        const el = new Terminal(name, attachment);
        params.connector.setAttachment(attachment);
        this.elementsCollection.put(Terminal, el);

        params.net.terminals.push(el);

        return el;
    }

    createWireJunction(params: WireJunctionParams): WireJoint {
        const name = params.name ?? this.nameAssginer.createNameFor(WireJoint);
        const el = new WireJoint(name, params.location, params.position, params.net);
        this.elementsCollection.put(WireJoint, el);
        return el;
    }

    createWire(params: WireParams): Wire {
        const name = params.name ?? this.nameAssginer.createNameFor(Wire)
        const el = new Wire(params.color, name, params.net, params.crossSectionArea);
        this.elementsCollection.put(Wire, el);

        // TODO: check for ability to connect, check nets and graph cycles
        if (params.from) {
            el.a = params.from;
            params.from.edges.push(el);
        }

        if (params.to) {
            el.b = params.to;
            params.to.edges.push(el);
        }

        return el;
    }

    createNet(params: NetParams): Net {
        const name = params.name ?? this.nameAssginer.createNameFor(Net)
        const el = new Net(name);
        this.elementsCollection.put(Net, el);
        return el;
    }
}