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
import { styled, ThemeProvider } from '@mui/material/styles';

// local components
import defaultTheme from '../../themes/default'

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

    render() {
        return(
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {this.props.headers.map(header => {
                                return <StyledTableCell key={header} align="right">{header}</StyledTableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.rows.map(row => {
                        return (
                            <ThemeProvider key={row.id} theme={defaultTheme}>
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    onClick={(event) => this.props.onClick(event, row.id)}
                                    selected={row.id === this.props.selected}
                                    hover
                                >
                                    {
                                        row.valuesArray.map(value => (
                                            <StyledTableCell key={`row ${row.id} column ${row.valuesArray.indexOf(value)}`} align="right">{value}</StyledTableCell>
                                        ))
                                    }
                                </TableRow>
                            </ThemeProvider>
                        )
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}