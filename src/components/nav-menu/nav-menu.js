import React from 'react';
import './nav-menu.css';

export default class NavMenu extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return(
            <div className={`nav-menu ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}></div>
        )
    }
}