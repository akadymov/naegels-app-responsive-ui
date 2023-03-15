import React from 'react';
import './nav-menu.css';

//MUI Icons
import FeedbackRoundedIcon from '@mui/icons-material/Feedback';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEvents';
import HomeRoundedIcon from '@mui/icons-material/Home';
import InfoRoundedIcon from '@mui/icons-material/Info';
import LogoutRoundedIcon from '@mui/icons-material/Logout';
import LoginRoundedIcon from '@mui/icons-material/Login';

// Integration modules
import Cookies from 'universal-cookie';
import NaegelsApi from '../../services/naegels-api-service';


export default class NavMenu extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            menuExpanded: false,
            hoveredItem: null,
            loggedIn: false
        }
    }
    Cookies = new Cookies();
    NaegelsApi = new NaegelsApi();

    CheckIfAlreadyLoggedIn = () => {
        const idToken = this.Cookies.get('idToken')
        if(idToken) {
            this.setState({ loggedIn: true })
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
                    <div className="menu-item-icon-container"><HomeRoundedIcon fontSize="large" color={this.state.loggedIn ? (this.state.hoveredItem === 'signout' ? 'action' : 'primary') : 'disabled'}/></div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container">
                            <p className={`menu-item-title ${this.state.loggedIn ? (this.state.hoveredItem === 'lobby' ? 'action' : '') : 'disabled'}`}>LOBBY</p>
                        </div>   
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
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`} id={this.state.loggedIn ? "signout" : "signin"} onMouseEnter={this.hoverItem} onMouseLeave={this.unhoverItems}>
                    <div className="menu-item-icon-container">
                        {this.state.loggedIn ?
                            <LogoutRoundedIcon fontSize="large" color={this.state.hoveredItem === 'signout' ? 'action' : 'primary'}/>
                        :
                            <LoginRoundedIcon fontSize="large" color={this.state.hoveredItem === 'signin' ? 'action' : 'primary'}/>
                        }
                    </div>
                    {this.state.menuExpanded ? 
                        <div className="menu-item-title-container"><p className={`menu-item-title ${this.state.hoveredItem === (this.state.loggedIn ? "signout" : "signin") ? 'action' : ''}`}>{this.state.loggedIn ? "SIGN OUT" : "SIGN IN"}</p></div>   
                    :
                        ''
                    }
                </div>
            </div>
        )
    }
}