import { Connector } from "../harness/connector";

export class TerminalAttachment {
    constructor(public readonly connector: Connector, public pin: number) {}
}