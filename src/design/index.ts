import { Design } from "./design";

export const getDesign = (): Design => {
    const d = new Design();

    const x01 = d.elementsFactory.createConnector({
        name: "x01",
        maxPinsQty: 81,
    })

    const f1 = d.elementsFactory.createFork({})
    const e1 = f1.connectWith(x01);
    e1.length = 90;

    const f2 = d.elementsFactory.createFork({})
    const e2 = f2.connectWith(f1);
    e2.length = 45;

    const f3 = d.elementsFactory.createFork({})
    f3.connectWith(f2).length = 60;

    const x016 = d.elementsFactory.createConnector({ name: "x016", maxPinsQty: 3 })
    x016.descr = 'Crankshaft position sensor'
    x016.connectWith(f3). length = 15;

    const x020 = d.elementsFactory.createConnector({ name: "x020", maxPinsQty: 3 }) // camshaft sens
    x020.descr = 'Camshaft position sensor'
    x020.connectWith(f3).length = 10;


    const x013 = d.elementsFactory.createConnector({ name: "x013", maxPinsQty: 2 }) // TWAT sens
    x013.descr = "TWAT sensor"
    x013.connectWith(f3).length = 10;

    const x20 = d.elementsFactory.createConnector({ name: "x20", maxPinsQty: 25 });
    x20.descr = "to the body harness";
    x20.connectWith(f1);

    const f4 = d.elementsFactory.createFork({})
    f4.connectWith(f1).length = 66;

    const xTAIR = d.elementsFactory.createConnector({ name: "TAIR", maxPinsQty: 2 });
    xTAIR.connectWith(f4).length = 15;

    const xMAF = d.elementsFactory.createConnector({ name: "MAF", maxPinsQty: 5 });
    xMAF.connectWith(f4).length = 19;

    const f05 = d.elementsFactory.createFork({});
    f05.connectWith(f1).length = 50;

    const xR1 = d.elementsFactory.createConnector({ name: "K1", maxPinsQty: 5 });
    xR1.connectWith(f05).length = 15;
    const xR2 = d.elementsFactory.createConnector({ name: "K2", maxPinsQty: 5 });
    xR2.connectWith(f05).length = 15;
    const xR3 = d.elementsFactory.createConnector({ name: "K3", maxPinsQty: 5 });
    xR3.connectWith(f05).length = 15;

    const sigGround = d.elementsFactory.createNet({ name: 'sig-gnd' });

    const sigGndTAIR = d.elementsFactory.createTerminal({ attachment: xTAIR, net: sigGround });
    const sigGndTWAT = d.elementsFactory.createTerminal({ attachment: x013, net: sigGround });
    const sigGndECU = d.elementsFactory.createTerminal({ attachment: x01, net: sigGround });
    const wjsiggnd1 = d.elementsFactory.createWireJunction({ location: e1, position: 10 });


    const sigGndTAIRWire = d.elementsFactory.createWire({ color: 'green', from: wjsiggnd1, to: sigGndTAIR, net: sigGround })
    const sigGndTWATWire = d.elementsFactory.createWire({ color: 'green', from: wjsiggnd1, to: sigGndTWAT, net: sigGround })
    const sigGndEcuWire = d.elementsFactory.createWire({ color: 'green', from: sigGndECU, to: wjsiggnd1, net: sigGround })
    sigGround.root = sigGndECU;

    const switchedBat = d.elementsFactory.createNet({ name: 'switched-bat' });

    const mafPwr = d.elementsFactory.createTerminal({ attachment: xMAF, net: switchedBat });
    const switchedBatteryRelay = d.elementsFactory.createTerminal({ attachment: xR1, net: switchedBat });
    const wjSwitchedBattery1 = d.elementsFactory.createWireJunction({ location: e1, position: 15 });

    d.elementsFactory.createWire({ color: 'red/wht', from: wjSwitchedBattery1, to: mafPwr, net: switchedBat })
    d.elementsFactory.createWire({ color: 'red/wht', from: wjSwitchedBattery1, to: switchedBatteryRelay, net: switchedBat })

    const commonGnd = d.elementsFactory.createNet({ name: 'common-gnd' });

    const mafGnd = d.elementsFactory.createTerminal({ attachment: xMAF, net: commonGnd })
    const ecuCGND1 = d.elementsFactory.createTerminal({ attachment: x01, net: commonGnd })
    const wjCommongGnd1 = d.elementsFactory.createWireJunction({ location: e1, position: 20 });

    const mafSignal = d.elementsFactory.createNet({ name: 'maf signal' });
    const sigMafMaf = d.elementsFactory.createTerminal({ attachment: xMAF, net: mafSignal });
    const sigMafEcu = d.elementsFactory.createTerminal({ attachment: x01, net: mafSignal });
    d.elementsFactory.createWire({ color: 'wht', from: sigMafMaf, to: sigMafEcu, net: mafSignal })
    d.elementsFactory.createWire({ color: 'brn/org', from: wjCommongGnd1, to: mafGnd, net: mafSignal });
    d.elementsFactory.createWire({ color: 'brn', from: ecuCGND1, to: wjCommongGnd1, net: mafSignal });

    return d;
}