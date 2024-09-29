import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo<{
data: { label?: string }, isConnectable: boolean
}>(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        { data.label }
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
