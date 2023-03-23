import React from 'react';

import './player-info.css';
import Avatar from '@mui/material/Avatar';

export default class PlayerInfo extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
    }
      
    stringAvatar(name) {
        return {
            sx: {
            bgcolor: this.stringToColor(name),
            },
            children: `${name[0][0]}`,
        };
    }

    render() {
        return(
            
                <div 
                    className={`player-info-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}
                    active={this.props.active ? 'true' : 'false'}
                >
                    <div className={`player-info-avatar-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                        <Avatar 
                            {...this.stringAvatar(this.props.username.toUpperCase())}
                            src={`/img/profile-pics/${this.props.username}.png`}
                            sx={{ 
                                width: this.props.isMobile ? 38 :61, 
                                height: this.props.isMobile ? 38 : 61,
                                outline: this.props.active ? '2px solid darkViolet' : 'none' 
                            }}
                        ></Avatar>
                    </div>
                    <div className={`player-data-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                        <div className={`player-username-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                        {this.props.username}
                        </div>
                        <div className={`player-bets-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <div className={`player-bets-label ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            bet
                            </div>
                            <div className={`player-bets-value ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            {this.props.betSize}
                            </div>
                        </div>
                        <div className={`player-took-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            <div className={`player-took-label ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            took
                            </div>
                            <div className={`player-took-value ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                            {this.props.tookTurns}
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}