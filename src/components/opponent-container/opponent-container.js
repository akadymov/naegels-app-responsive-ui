import React from 'react';

import './opponent-container.css';

//Local Components
import OpponentCards from '../opponent-cards';
import PlayerInfo from '../player-info/player-info';


export default class OpponentContainer extends React.Component{

    render() {
        return (
            <div 
                className={`opponent-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"} player${this.props.position} outof${this.props.numberOfPlayers}`}
            >
                <OpponentCards
                    cards={this.props.cards}
                ></OpponentCards>
                <PlayerInfo
                    username={this.props.username}
                    betSize={this.props.betSize}
                    tookBets={this.props.tookBets}
                    active={this.props.active}
                ></PlayerInfo>
            </div>
        )
    }
}