import React, { useEffect, useMemo } from 'react';
import {
  ReactFlow, applyEdgeChanges, applyNodeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  Background,
  Controls,
  addEdge,
  Connection,
  Position,
  ViewportPortal,
} from '@xyflow/react';

import { useState, useCallback } from 'react';

import { EditorWorkspace } from './components/EditorWorkspace'


import '@xyflow/react/dist/style.css';
import { getDesign } from './design';
import { NodePresenteation } from './app/editor/types';
import { Design } from './design/design';
import { CssBaseline } from '@mui/material';
import { NetList } from './components/NetList';




function App() {
  const [design, setDesign] = useState<Design>(getDesign());
  const [nodesPResentations, setNodesPresentations] = useState<NodePresenteation[]>([]);

  const [selectedNetName, setSelectedNetName] = useState<string | undefined>();
  const selectedNet = useMemo(() => selectedNetName ? design.nets.find(net => net.name === selectedNetName) : undefined, [selectedNetName, design])

  return (
    <>
      <CssBaseline />
      <div style={{ display: "grid", gridTemplateColumns: "20vw 80vw" }}>
        <div style={{ gridColumn: "1" }}>
          <NetList nets={design.nets} onNetClear={()=> setSelectedNetName(undefined)} onNetSelect={(net)=> {setSelectedNetName(net)}} selectedNet={selectedNetName}/>
        </div>
        <div style={{ gridColumn: "2" }}>
          <EditorWorkspace
            design={design}
            presentation={nodesPResentations}
            onPresentationChange={setNodesPresentations}
            selectedNet={selectedNet}
          />
        </div>
      </div>
    </>

  );
}

export default App;
