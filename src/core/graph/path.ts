import { Node } from "./node"

export const findPath = (a: Node, b: Node): Node[] | undefined => {
    const seenNodes = new Set<Node>();
    function recursive(path: Node[]): Node[] | undefined {
        const last = path[path.length - 1];
        if (last == b) {
            return path;
        }
        for(const e of last.edges) {
            const nextNode = e.anotherEndBy(last)
            if(seenNodes.has(nextNode)) {
                continue;
            }
            seenNodes.add(nextNode);
            const newPath = [...path, nextNode];
            const result = recursive(newPath);
            if(result) {
                return result;
            }
        }
        return undefined;
    }
    return recursive([a]);
}