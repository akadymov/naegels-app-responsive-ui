import React from 'react';

import './table-action-message.css';

export default class TableActionMessage extends React.Component{

    constructor(props) {
        super(props);
    }
    
    render() {
        console.log(this.props)
        
        return (
            <div className={`action-message-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <p className='action-message-text'>{this.props.message}</p>
            </div>
        )
    }
}