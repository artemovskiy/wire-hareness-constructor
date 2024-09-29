import { findPath } from "../graph/path";
import { HarnessNode } from "../harness/harness-node";
import { Terminal } from "./terminal";
import { WireNode } from "./wire-node";

export class Net {

    name: string;

    constructor(name: string) {
        this.name = name;
    }
    root?: WireNode;

    terminals: Terminal[] = [];

    listInvolvedHarnessNodes(): HarnessNode[] {
        const nodes = new Set<HarnessNode>();
        for (const iTerminal of this.terminals) {
            for (const jTerminal of this.terminals) {
                if (iTerminal === jTerminal) {
                    continue;
                }
                const path = findPath(iTerminal.attachment, jTerminal.attachment);
                if (!path) {
                    throw new Error("The net is not complete!");
                }
                path.forEach(n => nodes.add(n as HarnessNode));
            }
        }
        return Array.from(nodes.values());
    }
}