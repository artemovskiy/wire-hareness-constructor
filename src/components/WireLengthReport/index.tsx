import React from 'react';
import { WireLengthResult } from '../../core/analysis/types';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import { WireColorIcon } from '../WireColorIcon';
import { HarnessNode } from '../../core/harness/harness-node';
import { WireNode } from '../../core/nets/wire-node';
import { WireJoint } from '../../core/nets/wire-joint';
import { Terminal } from '../../core/nets/terminal';

export interface WireLengthReportProps {
    data: WireLengthResult[];
}

const harnessNodeText = (node: WireNode) => {
    if(node instanceof Terminal) {
        return node.attachment.name;
    }
    if(node instanceof WireJoint) {
        const wireJointLocation = node.location;
        const between = [
            (wireJointLocation.a as HarnessNode).name,
            (wireJointLocation.b as HarnessNode).name,
        ]
        return `${node.name} (between ${between.join(" and ")})`
    }
    return "unknown";
}

export const WireLegnthReport = ({ data }: WireLengthReportProps) => {
    return <Table>
        <TableBody>
            { data.map(i => <TableRow key={i.wire.name}>
                <TableCell>
                    { i.wire.name}
                </TableCell>
                <TableCell>
                    <WireColorIcon colorText={i.wire.color} />
                </TableCell>
                <TableCell>
                    { i.wire.net.name }
                </TableCell>
                <TableCell>{harnessNodeText( i.wire.a as HarnessNode)}</TableCell>
                <TableCell>{harnessNodeText( i.wire.b as HarnessNode)}</TableCell>
                <TableCell>
                    { i.length }
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>
}