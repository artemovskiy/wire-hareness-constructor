import { XYPosition } from "@xyflow/react";

export interface NodePresenteation {
    nodeId: string;
    position: XYPosition;
}

export interface TerminalDef {
    position: number;
    color: string;
    name: string;
    netName: string;
}