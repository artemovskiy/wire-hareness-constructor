import React, { ReactElement } from 'react';
import { getHexByText } from './library';

export interface WireColorIconProps {
    colorText: string;
}


export const WireColorIcon = ({ colorText }: WireColorIconProps): ReactElement => {
    const parts = colorText.split('/');
    if (parts.length > 1) {
        if (parts.length > 2) {
            throw new Error(`To many color parts in ${colorText}`)
        }
        const pColor = getHexByText(parts[0])
        const sColor = getHexByText(parts[1])
       return <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <rect width="4" height="6" x="0" y="9" fill={`#${pColor}`} />
                <rect width="4" height="6" x="4" y="9" fill={`#${sColor}`} />
                <rect width="8" height="6" x="8" y="9" fill={`#${pColor}`} />
                <rect width="4" height="6" x="16" y="9" fill={`#${sColor}`} />
                <rect width="4" height="6" x="20" y="9" fill={`#${pColor}`} />
            </svg>
       </div> 
    } else {
        const color = getHexByText(parts[0])
        return <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <rect width="24" height="6" x="0" y="9" fill={`#${color}`} />
            </svg>
        </div>
    }

}