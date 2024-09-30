import { Constructor } from "../util/types";

export interface DesignElement {
    name: string;
}

export class ElementsCollection {
    private readonly elements: Map<Constructor<DesignElement>, Map<string, DesignElement>> = new Map();
    put<T extends DesignElement>(type: Constructor<DesignElement>, el: T): void {
        if(!(el instanceof type)) {
            throw new Error();
        }
        let elementCollection = this.elements.get(type) as Map<string, T>;
        if(!elementCollection) {
            elementCollection = new Map<string, T>();
            this.elements.set(type, elementCollection);
        } else {
            if(elementCollection.has(el.name)) {
                throw new Error(`Element name ${el.name} is occupied`);
            }
            elementCollection.forEach(value => {
                if(value === el) {
                    throw new Error(`The element is already put to the collection with name ${value.name}`);
                }
            })
        }
        elementCollection.set(el.name, el);
    } 
    
    
    get<T extends DesignElement>(type: Constructor<DesignElement>, name: string): T | null {
        const elementCollection = this.elements.get(type) as Map<string, T> ?? new Map<string, T>();
        return elementCollection.get(name) ?? null;
    }

    all<T extends DesignElement>(type: Constructor<DesignElement>): readonly T[] {
        const elementCollection = this.elements.get(type) as Map<string, T> ?? new Map<string, T>();
        return Array.from(elementCollection.values());
    }
}