import { ColorDef } from "./types";

export const colors: ColorDef[] = [
    {
        primaryName: 'green',
        aliases: ['grn'],
        hexValue: "11BC0A"
    },{
        primaryName: 'red',
        aliases: [],
        hexValue: "EC0000"
    },{
        primaryName: 'white',
        aliases: ['wht'],
        hexValue: "ffffff"
    },{
        primaryName: 'brown',
        aliases: ['brn'],
        hexValue: "762600"
    },{
        primaryName: 'orange',
        aliases: ['org'],
        hexValue: "FA840E"
    },
]

export const getHexByText = (text: string): string => {
    const normalizedText = text.toLowerCase();
    const color = colors.find(i => i.primaryName === normalizedText || i.aliases.includes(normalizedText));
    if(!color) {
        throw new Error('unexpected color text: ' + text)
    }
    return color.hexValue
}