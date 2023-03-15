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
            menuExpanded: false,
            hoveredItem: null
        }
    }

    expandMenu = () => {
        this.setState({ menuExpanded: true})
    }

    wrapMenu = () => {
        this.setState({ menuExpanded: false})
    }

    hoverItem = (e) => {
        this.setState({ hoveredItem: e.target.id })
    }

    unhoverItems = () => {
        this.setState({ hoveredItem: null })
    }

    render() {

        const ScreenSizeClassPostfix = this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")
        const ScreenOrientationClassPostfix = this.props.isPortrait ? "portrait" : "landscape"

        return(
            <div className={`nav-menu ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} onMouseOver={this.expandMenu} onMouseLeave={this.wrapMenu}> {/* FIXME: when hovering element above function is not triggered*/}
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} id="feedback" onMouseEnter={this.hoverItem} onMouseLeave={this.unhoverItems}>
                    <div className="menu-item-icon-container"><FeedbackRoundedIcon fontSize="large" color={this.state.hoveredItem === 'feedback' ? 'action' : 'primary'}/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className={`menu-item-title ${this.state.hoveredItem === 'feedback' ? 'action' : ''}`}>FEEDBACK</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} id="leaderboard" onMouseEnter={this.hoverItem} onMouseLeave={this.unhoverItems}>
                    <div className="menu-item-icon-container"><EmojiEventsRoundedIcon fontSize="large" color={this.state.hoveredItem === 'leaderboard' ? 'action' : 'primary'}/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className={`menu-item-title ${this.state.hoveredItem === 'leaderboard' ? 'action' : ''}`}>LEADERBOARD</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} id="lobby" onMouseEnter={this.hoverItem} onMouseLeave={this.unhoverItems}>
                    <div className="menu-item-icon-container"><HomeRoundedIcon fontSize="large" color={this.state.hoveredItem === 'lobby' ? 'action' : 'primary'}/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className={`menu-item-title ${this.state.hoveredItem === 'lobby' ? 'action' : ''}`}>LOBBY</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} id="about" onMouseEnter={this.hoverItem} onMouseLeave={this.unhoverItems}>
                    <div className="menu-item-icon-container"><InfoRoundedIcon fontSize="large" color={this.state.hoveredItem === 'about' ? 'action' : 'primary'}/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className={`menu-item-title ${this.state.hoveredItem === 'about' ? 'action' : ''}`}>ABOUT</p></div>   
                    :
                        ''
                    }
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} id="signout" onMouseEnter={this.hoverItem} onMouseLeave={this.unhoverItems}>
                    <div className="menu-item-icon-container"><LogoutRoundedIcon fontSize="large" color={this.state.hoveredItem === 'signout' ? 'action' : 'primary'}/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className={`menu-item-title ${this.state.hoveredItem === 'signout' ? 'action' : ''}`}>SIGN OUT</p></div>   
                    :
                        ''
                    }
                </div>
            </div>
        )
    }
}