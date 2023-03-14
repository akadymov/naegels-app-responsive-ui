import React from 'react';

import './closed-cards.css'

export default class OpponentCards extends React.Component{

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {

        const cards = []
        
        for (var i = 0; i < this.props.cards; i++) {
            cards.push(
                <div 
                    className="opponent-card" 
                    style={{
                        zindex: this.props.cards-i, 
                        left: i*10,
                        top: -i*50
                    }}
                ></div>
            )
        }

        return (
            <div 
                className="cards-container"
                style={{
                    left: -(this.props.cards-1)*5
                }}
            >{cards}</div>
        )
    }
}
