import { Handle, NodeProps, Position } from '@xyflow/react'
import React, { memo } from 'react';
import Typography from "@mui/material/Typography";
import { colors } from '@mui/material';
import { WireColorIcon } from '../WireColorIcon';

type CommonColuns = {
  name: string
  position: number;
  positionReference: string;
  endsQty: number;
  net: string;
}

type WireJunctionsTableRow = {
  common?: CommonColuns;
  nodeName: string;
  color: string;
  key: string;
}

export const WireJunctionsNode = memo(({ isConnectable, data }: NodeProps): React.ReactElement => {
  const wireJunctions = data.data as {
    name: string
    position: number;
    positionReference: string;
    net: string;
    ends: { nodeName: string, color: string; }[];

  }[];

  const rows: WireJunctionsTableRow[] = wireJunctions.map((j) => {
    const common = {
      name: j.name,
      net: j.net,
      position: j.position,
      positionReference: j.positionReference,
      endsQty: j.ends.length,
    }
    return j.ends.map((e, i) => {
      if (i == 0) {
        return { common, nodeName: e.nodeName, color: e.color, key: j.name + e.nodeName }; // TODO use terinal name or pin position
      }
      return { nodeName: e.nodeName, color: e.color, key: j.name + e.nodeName }
    })
  }).flat();

  return <>
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#555' }}
      onConnect={(params) => console.log('handle onConnect', params)}
      isConnectable={isConnectable}
    />
    <div>
      <div>
        <Typography>{data.length as number}</Typography>
      </div>
      <div>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td style={{ border: "1px solid #000000", textAlign: 'center' }} colSpan={5}>wire junctions</td>
            </tr>
          </thead>
          <tbody>
            {rows.map(i => <tr key={i.key}>
              {i.common && <>
                <td style={{ border: "1px solid #000000" }} rowSpan={i.common.endsQty}>{i.common.name}</td>
                <td style={{ border: "1px solid #000000" }} rowSpan={i.common.endsQty}>{i.common.net}</td>
                <td style={{ border: "1px solid #000000" }} rowSpan={i.common.endsQty}>{i.common.position as number}cm from {i.common.positionReference}</td>
              </>
              }
              <td style={{ border: "1px solid #000000" }}><WireColorIcon colorText={i.color} /></td>
              <td style={{ border: "1px solid #000000" }}>{i.nodeName}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#555' }}
      isConnectable={isConnectable}
    />
  </>
});