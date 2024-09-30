import { Terminal } from "../core/nets/terminal";
import { Connector } from "../core/harness/connector";
import { Fork } from "../core/harness/fork";
import { HarnessEdge } from "../core/harness/harness-edge";
import { Constructor } from "../util/types";
import { DesignElement } from "./elements-collection";
import { Net } from "../core/nets/net";
import { Wire } from "../core/nets/wire";
import { WireJoint } from "../core/nets/wire-joint";

const REFERENCE_DESIGNATORS: Map<Constructor<DesignElement>, string> = new Map();
REFERENCE_DESIGNATORS.set(Connector, "X");
REFERENCE_DESIGNATORS.set(Fork, "Y");
REFERENCE_DESIGNATORS.set(HarnessEdge, "E");
REFERENCE_DESIGNATORS.set(Net, "N")
REFERENCE_DESIGNATORS.set(Wire, "W")
REFERENCE_DESIGNATORS.set(WireJoint, "J")
REFERENCE_DESIGNATORS.set(Terminal, "T")


export class NameAssginer {

    private readonly counter: Map<Constructor<DesignElement>, number> = new Map();

    createNameFor(type: Constructor<DesignElement>): string {
        let typeCounter = this.counter.get(type) ?? 0;
        typeCounter += 1;
        this.counter.set(type, typeCounter);
        const refrenceDesignator = this.getReferenceDesignator(type);
        return `${refrenceDesignator}${typeCounter}`;
    }

    getReferenceDesignator(type: Constructor<DesignElement>): string {
        const d = REFERENCE_DESIGNATORS.get(type);
        if(!d) {
            throw new Error(`Can not find a reference designator for component: ${type.name}`);
        }
        return d;
    }
}