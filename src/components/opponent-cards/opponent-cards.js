import React from 'react';

import './opponent-cards.css'

export default class OpponentCards extends React.Component{
    
    render() {

        const cards = []
        const numberOfCards = this.props.cards ? this.props.cards : 0
        
        for (var i = 0; i < numberOfCards; i++) {
            cards.push(
                <div key={`card ${i}`}
                    className="opponent-card" 
                    style={{
                        zindex: numberOfCards-i, 
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
                    left: -(numberOfCards-1)*5
                }}
            >{cards}</div>
        )
    }
}
