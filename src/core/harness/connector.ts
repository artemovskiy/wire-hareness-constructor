import { is_Int } from "../../util/number";
import { TerminalAttachment } from "../nets/terminal-attachment";
import { HarnessNode } from "./harness-node";

export enum ConnectorCantPlaceReason {
    PIN_INCORRECT_NUMBER = 'PIN_INCORRECT_NUMBER',
    PIN_IS_OCCUPIED = 'PIN_IS_OCCUPIED',
}

export class Connector extends HarnessNode {

    private readonly attachments: TerminalAttachment[] = [];

    constructor(name: string, public readonly numPins: number) {
        super(name);
    }

    checkCanPlacePin(pin: number): ConnectorCantPlaceReason | null {
        if(pin < 0 || pin > this.numPins || !is_Int(pin)) {
            return ConnectorCantPlaceReason.PIN_INCORRECT_NUMBER
        }
        const pinIndex = this.attachments.findIndex(i => i.pin === pin);
        if(pinIndex > -1) {
            return ConnectorCantPlaceReason.PIN_IS_OCCUPIED
        }
        return null;
    }

    setAttachment(attachment: TerminalAttachment) {
        const checkResult = this.checkCanPlacePin(attachment.pin);
        if(checkResult) {
            throw new Error(`Cant set attachment ${checkResult} on connector ${this.name} by pin ${attachment.pin}}`);
        }
        if(attachment.connector !== this){ 
            throw new Error("Invalid attachemtn.connector");
        }
        this.attachments.push(attachment);
    }
}