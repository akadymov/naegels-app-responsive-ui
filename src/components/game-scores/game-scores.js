import React from 'react';

import './game-scores.css';

//MUI components
import Modal from '@mui/material/Modal';
import { ThemeProvider } from '@mui/material/styles';

// local components
import defaultTheme from '../../themes/default';
import NaegelsTableContainer from '../../components/naegels-table-container';
import FormButton from '../form-button';


export default class GameScores extends React.Component{

    render () {

        return(
            <Modal open={this.props.open}>
                <div className={`game-scores-modal-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    <ThemeProvider theme={defaultTheme}>
                        <div className={`game-scores-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <NaegelsTableContainer
                                padding='4px'
                                headers={this.props.scoresHeaders}
                                rows={this.props.scores}
                                height={this.props.isMobile ? '71vh' : '60vh'}
                            ></NaegelsTableContainer>
                        </div>
                        <div className={`scores-controls-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <div className="close-scores-button-container">
                                <FormButton
                                    key='close_game_scores'
                                    variant='outlined'
                                    text='Back to game'
                                    onSubmit={this.props.closeModal}
                                    size='small'
                                ></FormButton>
                            </div>
                        </div>
                    </ThemeProvider>
                </div>
            </Modal>
        )
    }
}