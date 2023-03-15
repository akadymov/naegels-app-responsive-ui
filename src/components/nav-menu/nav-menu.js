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
        }
    }

    render() {

        const ScreenSizeClassPostfix = this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")
        const ScreenOrientationClassPostfix = this.props.isPortrait ? "portrait" : "landscape"

        return(
            <div className={`nav-menu ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <FeedbackRoundedIcon fontSize="large"/>
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <EmojiEventsRoundedIcon fontSize="large"/>
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <HomeRoundedIcon fontSize="large"/>
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <InfoRoundedIcon fontSize="large"/>
                </div>
                <div className={`menu-item-container ${ ScreenSizeClassPostfix} ${ ScreenOrientationClassPostfix }`}>
                    <LogoutRoundedIcon fontSize="large"/>
                </div>
            </div>
        )
    }
}