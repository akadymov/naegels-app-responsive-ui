import React from 'react';

import './naegels-table-container.css';

// MUI components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled, ThemeProvider } from '@mui/material/styles';


import Switch from '@mui/material/Switch';

import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

// local components
import defaultTheme from '../../themes/default';
import FormButton from '../form-button';

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
            <TableContainer component={Paper} sx={{ height:this.props.height, overflow: 'scroll'}}>
                <Table stickyHeader aria-label="simple table" >
                    <TableHead>
                        <TableRow>
                            {this.props.headers.map(header => {
                                return <StyledTableCell key={header} align={this.props.headers.indexOf(header) === 0 ? 'left' : 'right'}>{header}</StyledTableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.rows.map(row => {
                        return (
                            <ThemeProvider key={`theme-provider-${row.id}`} theme={defaultTheme}>
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    onClick={(event) => this.props.onClick(event, row.id)}
                                    selected={row.id === this.props.selected}
                                    hover
                                >
                                    {
                                        row.dataArray.map(data => {
                                                switch(data.type){
                                                    case 'text':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align="right">
                                                                {data.value}
                                                            </StyledTableCell>
                                                        )
                                                    case 'player':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align="right">
                                                                <div className="username-container">
                                                                    <span>{data.username}</span>
                                                                    {data.host ? <SupervisorAccountIcon/> : ''}
                                                                </div>
                                                            </StyledTableCell>
                                                        )
                                                    case 'switch':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align="right">
                                                                <Switch
                                                                    defaulrChecked={data.checked}
                                                                    disabled={data.disabled}
                                                                    username={data.username}
                                                                    onChange={data.onChange}
                                                                />
                                                            </StyledTableCell>
                                                        )
                                                    case 'button':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align="right">
                                                                <FormButton 
                                                                    variant={data.variant}
                                                                    text={data.text}
                                                                    onSubmit={data.onSubmit}
                                                                    width={data.width}
                                                                    size={data.size}
                                                                    disabled={data.disabled}
                                                                    color = {data.color}
                                                                ></FormButton>
                                                            </StyledTableCell>
                                                        )
                                                    default: // text
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align="right">
                                                                {data.value}
                                                            </StyledTableCell>
                                                        )
                                                }
                                            })
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