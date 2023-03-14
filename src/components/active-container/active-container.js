import React from 'react';

import './active-container.css'

export default class ActiveContainer extends React.Component{
    
    render() {
        return (
            <div className="active-container" popupError={this.props.popupError} confirmActionMsg={this.props.confirmActionMsg}>
                {this.props.children}
            </div>
        )
    }
}
