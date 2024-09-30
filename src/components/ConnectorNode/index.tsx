import React, { memo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Typography } from '@mui/material';
import { TerminalDef } from '../../app/editor/types';
import { WireColorIcon } from '../WireColorIcon';

export const ConnectorNode = memo<NodeProps>(({ data, isConnectable }) => {
  const terminalsData = (data.terminals ?? []) as TerminalDef[];
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div style={{
        backgroundColor: "#FFF",
        border: "1px solid #000",

      }}>

        <table style={{
          borderCollapse: "collapse",

        }}>
          <thead>
            <tr><td colSpan={4} align='center'> <Typography>{data.label as string}</Typography></td></tr>
            <tr style={{ borderTop: "1px solid #000" }}>
              <td align='center' style={{ borderRight: "1px solid #000" }}> <Typography>Pin</Typography></td>
              <td align='center' colSpan={2} style={{ borderRight: "1px solid #000" }}> <Typography>Name</Typography></td>
              <td align='center'> <Typography>Net</Typography></td>
              </tr>
          </thead>
          <tbody>
            {terminalsData.map(t => {
              return <tr key={t.name} style={{ borderTop: "1px solid #000" }}>
                <td style={{ borderRight: "1px solid #000" }}>{t.position}</td>
                <td><WireColorIcon colorText={t.color} /></td>
                <td style={{ borderRight: "1px solid #000" }}>{t.name}</td>
                <td>{t.netName}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: 10, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});
