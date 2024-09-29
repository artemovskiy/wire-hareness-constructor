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




function App() {
  const [design, setDesign] = useState<Design>(getDesign());
  const [nodesPResentations, setNodesPresentations] = useState<NodePresenteation[]>([]);

  const [selectedNetName, setSelectedNetName] = useState<string | undefined>();
  useEffect(() => {
    console.log("design reinit")
    setTimeout(() => setSelectedNetName(design.nets[0].name), 1000)
  }, [design])
  const selectedNet = useMemo(() => selectedNetName ? design.nets.find(net => net.name === selectedNetName) : undefined, [selectedNetName, design])

  return (
    <div style={{ display: "grid", gridTemplateColumns: "20vw 80vw"}}>
      <div style={{gridColumn: "1" }}>

      </div>
      <div style={{gridColumn: "2" }}>
        <EditorWorkspace
          design={design}
          presentation={nodesPResentations}
          onPresentationChange={setNodesPresentations}
          selectedNet={selectedNet}
        />
      </div>
    </div>
  );
}

export default App;
