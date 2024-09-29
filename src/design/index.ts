import { Connector } from "../core/harness/connector";
import { Fork } from "../core/harness/fork";
import { HarnessEdge } from "../core/harness/harness-edge";
import { Net } from "../core/nets/net";
import { Terminal } from "../core/nets/terminal";
import { Wire } from "../core/nets/wire";
import { WireJoint } from "../core/nets/wire-joint";
import { Design } from "./design";

export const getDesign = (): Design => {
    const x01 = new Connector();
    x01.title = "x01";
    x01.numPins = 81;

    const d = new Design(x01);

    const f1 = d.createFork();
    const e1 = f1.connectWith(x01);
    e1.length = 90;

    const f2 = d.createFork();
    const e2 = f2.connectWith(f1);
    e2.length = 45;

    const f3 = d.createFork();
    f3.connectWith(f2).length = 60;

    const x016 = new Connector(); // crankshaft sens
    x016.title = "x016";
    x016.numPins = 3;
    x016.descr = 'Crankshaft position sensor'
    x016.connectWith(f3);

    const x020 = new Connector(); // camshaft sens
    x020.title = "x020";
    x020.numPins = 3;
    x020.descr = 'Camshaft position sensor'
    x020.connectWith(f3);


    const x013 = new Connector(); // TWAT sens
    x013.title = "x013";
    x013.numPins = 2;
    x013.descr = "TWAT sensor"
    x013.connectWith(f3);

    const x20 = new Connector();
    x20.title = "x20";
    x20.numPins = 25;
    x20.descr = "to the body harness";
    x20.connectWith(f1);

    const f4 = d.createFork();
    f4.connectWith(f1).length = 66;

    const xTAIR = new Connector();
    xTAIR.title = "TAIR"
    xTAIR.connectWith(f4).length = 15;

    const xMAF = new Connector();
    xMAF.title = "MAF"
    xMAF.connectWith(f4).length = 19;

    const f05 = d.createFork();
    f05.connectWith(f1).length = 50;

    const xR1 = new Connector();
    xR1.title = 'relay 1';
    xR1.connectWith(f05).length = 15;
    const xR2 = new Connector();
    xR2.title = 'relay 2';
    xR2.connectWith(f05).length = 15;
    const xR3 = new Connector();
    xR3.title = 'relay 3';
    xR3.connectWith(f05).length = 15;


    const sigGround = new Net();
    const sigGndTAIR = new Terminal(xTAIR);
    sigGround.terminals.push(sigGndTAIR);
    sigGndTAIR.title = `${xTAIR.title}-0`;
    const sigGndTAIRWire = new Wire('green');
    sigGndTAIRWire.a = sigGndTAIR;
    sigGndTAIR.wire = sigGndTAIRWire;

    const sigGndTWAT = new Terminal(x013);
    sigGround.terminals.push(sigGndTWAT);
    sigGndTWAT.title = `${x013.title}-0`;
    const sigGndTWATWire = new Wire('green');
    sigGndTWATWire.a = sigGndTWAT;
    sigGndTWAT.wire = sigGndTWATWire;

    const sigGndECU = new Terminal(x01);
    sigGround.terminals.push(sigGndECU);
    sigGndECU.title = `${x01.title}-0`;
    const sigGndEcuWire = new Wire('green');
    sigGndEcuWire.a = sigGndECU;
    sigGndECU.wire = sigGndEcuWire; 

    console.log(sigGndECU);

    const sigGndWires = [sigGndTAIR.wire, sigGndTWAT.wire, sigGndECU.wire];
    const wjsiggnd1 = d.createWireJoint(sigGround, 'wj1');
    wjsiggnd1.edges = sigGndWires;
    wjsiggnd1.location = e1;
    sigGndWires.forEach(w => w.b = wjsiggnd1);

    sigGround.root = sigGndECU;

    d.nets.push(sigGround);

    return d;
}