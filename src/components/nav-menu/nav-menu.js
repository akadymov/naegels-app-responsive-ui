import React from 'react';
import './nav-menu.css';
// import { FeedbackRounded, EmojiEventsRounded, , , ,  } from '@mui/icons-material';
import FeedbackRoundedIcon from '@mui/icons-material/Feedback';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEvents';
import HomeRoundedIcon from '@mui/icons-material/Home';
import InfoRoundedIcon from '@mui/icons-material/Info';
import LogoutRoundedIcon from '@mui/icons-material/Logout';
import LoginRoundedIcon from '@mui/icons-material/Login';

export default class NavMenu extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            menuExpanded: false
        }
    }

    expandMenu = () => {
        this.setState({ menuExpanded: true})
    }

    wrapMenu = () => {
        this.setState({ menuExpanded: false})
    }

    render() {

        console.log(this.state.onMouseOver)

        const ScreenSizeClassPostfix = this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")
        const ScreenOrientationClassPostfix = this.props.isPortrait ? "portrait" : "landscape"

        return(
            <div className={`nav-menu ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} onMouseOver={this.expandMenu} onMouseLeave={this.wrapMenu}>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <div className="menu-item-icon-container"><FeedbackRoundedIcon fontSize="large"/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className="menu-item-title">FEEDBACK</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <div className="menu-item-icon-container"><EmojiEventsRoundedIcon fontSize="large"/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className="menu-item-title">LEADERBOARD</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <div className="menu-item-icon-container"><HomeRoundedIcon fontSize="large"/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className="menu-item-title">LOBBY</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <div className="menu-item-icon-container"><InfoRoundedIcon fontSize="large"/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className="menu-item-title">ABOUT</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <div className="menu-item-icon-container"><LogoutRoundedIcon fontSize="large"/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className="menu-item-title">SIGN OUT</p></div>   
                    :
                        ''
                    }
                </div>
            </div>
        )
    }
}