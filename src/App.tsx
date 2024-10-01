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

function debounce<TArgs extends any[]>(callee: (...args: TArgs) => void, timeoutMs: number) {
  let lastCall: number | undefined;
  let lastCallTimer: NodeJS.Timeout;
  return function perform(...args: TArgs) {
    let previousCall = lastCall

    lastCall = Date.now()

    if (previousCall && (lastCall - previousCall <= timeoutMs)) {
      clearTimeout(lastCallTimer)
    }

    lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}

const debouncedSavePres = debounce((val: NodePresenteation[]) => {
  console.log("arrangement saved")
  window.localStorage.setItem('items_resentation', JSON.stringify(val));
}, 1000)

const initalItemsPresentationContent = window.localStorage.getItem('items_resentation');
  let initalItemsPresentation: NodePresenteation[] = [];
  if(initalItemsPresentationContent) {
    initalItemsPresentation = JSON.parse(initalItemsPresentationContent);
  }
  console.log({ initalItemsPresentation})

function App() {
  const [design, setDesign] = useState<Design>(getDesign());
  
  const [nodesPresentations, setNodesPresentations] = useState<NodePresenteation[]>(initalItemsPresentation);

  useEffect(() => {
    
  }, [nodesPresentations]);

  const onPresentationChange = useCallback((val: NodePresenteation[]) => {
    console.log('change pres', val)
    setNodesPresentations(val);
    debouncedSavePres(val);
  }, []);

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
            presentation={nodesPresentations}
            onPresentationChange={onPresentationChange}
            selectedNet={selectedNet}
          />
        </div>
      </div>
    </>

  );
}

export default App;
