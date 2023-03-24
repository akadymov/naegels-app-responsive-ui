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
import Score from '../score';



export default class NaegelsTableContainer extends React.Component{

    render() {

        const StyledTableCell = styled(TableCell)(() => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 'bold'
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
                padding: this.props.padding || '16px'
            },
        }));

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
                                    onClick={this.props.onClick ? (event) => this.props.onClick(event, row.id) : ''}
                                    selected={row.id === this.props.selected}
                                    hover
                                >
                                    {
                                        row.dataArray.map(data => {
                                                switch(data.type){
                                                    case 'text':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align={row.dataArray.indexOf(data) === 0 ? 'left' : 'right'}>
                                                                {data.value}
                                                            </StyledTableCell>
                                                        )
                                                    case 'player':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align={row.dataArray.indexOf(data) === 0 ? 'left' : 'right'}>
                                                                <div 
                                                                    className="username-container" 
                                                                    onClick={()=>window.location.replace('/profile/' + data.username)}
                                                                >
                                                                    <span>{data.username}</span>
                                                                    {data.host ? <SupervisorAccountIcon/> : ''}
                                                                </div>
                                                            </StyledTableCell>
                                                        )
                                                    case 'switch':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align={row.dataArray.indexOf(data) === 0 ? 'left' : 'right'}>
                                                                <Switch
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                    key={`ready-switch-${data.username}`}
                                                                    id={`ready-switch-${data.username}`}
                                                                    defaultChecked={data.defaultChecked}
                                                                    checked={data.checked}
                                                                    disabled={data.disabled}
                                                                    username={data.username}
                                                                    onChange={data.onChange}
                                                                />
                                                            </StyledTableCell>
                                                        )
                                                    case 'button':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align={row.dataArray.indexOf(data) === 0 ? 'left' : 'right'}>
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
                                                    case 'hand id':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align={row.dataArray.indexOf(data) === 0 ? 'left' : 'right'}>
                                                                <p key={`handspan ${data.cards}-${data.trump}-${row.dataArray.indexOf(data)}`} className={`${data.trump} suit-container`}>{data.cards}</p>
                                                            </StyledTableCell>
                                                        )
                                                    case 'score':
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align={row.dataArray.indexOf(data) === 0 ? 'left' : 'right'}>
                                                                <Score
                                                                    total={data.total}
                                                                    betSize={data.betSize}
                                                                    tookTurns={data.tookTurns}
                                                                    bonus={data.bonus}
                                                                    score={data.score}
                                                                ></Score>
                                                            </StyledTableCell>
                                                        )
                                                    default: // text
                                                        return(
                                                            <StyledTableCell key={`row ${row.id} column ${row.dataArray.indexOf(data)}`} align={row.dataArray.indexOf(data) === 0 ? 'left' : 'right'}>
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