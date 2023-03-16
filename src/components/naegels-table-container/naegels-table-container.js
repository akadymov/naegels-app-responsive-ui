import React from 'react';

import './naegels-table-container.css';

// MUI table components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';


const StyledTableRow = styled(TableRow)(() => ({
    // every 1 out of 2 row color
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgb(237, 240, 239)',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    // on hover color
    "&:hover": {
        backgroundColor: 'lightGreen'
    }
}));

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


export default class NaegelsTableContainer extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {this.props.headers.map(header => {
                                return <StyledTableCell align="right">{header}</StyledTableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.rows.map(row => (
                        <StyledTableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {
                                row.valuesArray.map(value => (
                                    <StyledTableCell align="right">{value}</StyledTableCell>
                                ))
                            }
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}