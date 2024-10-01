import React, { memo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Typography } from '@mui/material';
import { TerminalDef } from '../../app/editor/types';

export const ForkNode = memo<NodeProps>(({ data, isConnectable }) => {
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
        width: 60,
        height: 40,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Typography>{data.label as string}</Typography>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});
