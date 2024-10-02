import React, { useEffect, useMemo } from 'react';
import { useState, useCallback } from 'react';

import { EditorWorkspace } from './components/EditorWorkspace'


import '@xyflow/react/dist/style.css';
import { getDesign } from './design';
import { NodePresenteation } from './app/editor/types';
import { Design } from './design/design';
import { Box, CssBaseline, Link, Modal } from '@mui/material';
import { NetList } from './components/NetList';
import { Wire } from './core/nets/wire';
import { WireLegnthReport } from './components/WireLengthReport';
import { WireLengthResult } from './core/analysis/types';

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
if (initalItemsPresentationContent) {
  initalItemsPresentation = JSON.parse(initalItemsPresentationContent);
}
console.log({ initalItemsPresentation })

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 680,
  backgroundColor: '#ECECEC',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [design, setDesign] = useState<Design>(getDesign());

  const wiresLengths = useMemo(() => {
    return design.elementsCollection.all<Wire>(Wire).map(wire => ({ wire, length: wire.getLength() } as WireLengthResult));
  }, [design])

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

  const [wireLengthModalOpen, setWireLengthModalOpen] = useState(false);

  return (
    <>
      <CssBaseline />
      <div style={{ display: "grid", gridTemplateColumns: "20vw 80vw" }}>
        <div style={{ gridColumn: "1" }}>
          <NetList nets={design.nets} onNetClear={() => setSelectedNetName(undefined)} onNetSelect={(net) => { setSelectedNetName(net) }} selectedNet={selectedNetName} />
          <Link onClick={() => setWireLengthModalOpen(true)}>Show wire lengths</Link>
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
      <Modal open={wireLengthModalOpen} onClose={() => setWireLengthModalOpen(false)}>
        <Box sx={style}>
          <WireLegnthReport data={wiresLengths} />
        </Box>
      </Modal>
    </>

  );
}

export default App;
