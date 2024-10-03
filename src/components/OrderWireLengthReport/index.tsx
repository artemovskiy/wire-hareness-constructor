import React, { useMemo } from 'react';
import { WireLengthResult } from '../../core/analysis/types';
import { Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { WireColorIcon } from '../WireColorIcon';

export interface OrderWireLengthReportRow {
    id: string;
    color: string;
    length: number;
    crossSectionArea: number;
}

export interface WireLengthReportProps {
    data: WireLengthResult[];
}

export const OrderWireLengthReport = ({ data }: WireLengthReportProps) => {
    const orderWireLength: OrderWireLengthReportRow[] = useMemo(() => {
        const wireLengths = new Map<string, WireLengthResult[]>();
        for(const item of data) {
            let collection = wireLengths.get(`${item.wire.color}-${item.wire.crossSectionArea}`);
            if(!collection) {
                collection = [];
                wireLengths.set(`${item.wire.color}-${item.wire.crossSectionArea}`, collection);
            }
            collection.push(item)
        }

        const rows: OrderWireLengthReportRow[] = [];
        wireLengths.forEach((i) => {
            const totalLength = i.reduce((acc, value) => acc + value.length, 0);
            rows.push({
                id: `${i[0].wire.color}-${i[0].wire.crossSectionArea}`,
                length: totalLength,
                color: i[0].wire.color,
                crossSectionArea: i[0].wire.crossSectionArea,
            })
        })

        return rows;
    }, [data])

    return <Table>
        <TableBody>
            { orderWireLength.map(i => <TableRow key={i.id}>
                <TableCell>
                    <WireColorIcon colorText={i.color} />
                    <Typography>{ i.color }</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{i.crossSectionArea}</Typography>
                </TableCell>
                <TableCell>
                    { i.length }
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>
}