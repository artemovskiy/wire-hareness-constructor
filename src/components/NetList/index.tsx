import React, { ReactElement } from "react";
import { Net } from "../../core/nets/net";
import Grid2 from "@mui/material/Grid2";
import { Box, IconButton, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { WireColorIcon } from "../WireColorIcon";

export interface NetListProps {
    nets: Net[];
    selectedNet: undefined | string
    onNetSelect: (netId: string) => void
    onNetClear: () => void
}

export const NetList = ({ nets, selectedNet, onNetClear, onNetSelect }: NetListProps): ReactElement => {
    return <Box>
        <Grid2 container>
            <Grid2 size={10}>
                <Typography variant="h4">NEts</Typography>
            </Grid2>
            <Grid2 size={2}>
                {selectedNet && <IconButton onClick={() => { onNetClear() }}>
                    <ClearIcon />
                </IconButton>}
            </Grid2>
        </Grid2>
        <ul>
            {nets.map(n => <li key={n.name}>
                <Typography
                    onClick={() => onNetSelect(n.name)}
                    style={{ textDecoration: n.name === selectedNet ? "underline" : undefined }}
                >{n.name}</Typography>
                { /* TODO: handle differet wire colors within the net */}
                <WireColorIcon colorText={n.terminals[0].wire.color} />
            </li>)}
        </ul>
    </Box>
}