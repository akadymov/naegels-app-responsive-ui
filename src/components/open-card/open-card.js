import React from 'react';

import './open-card.css';

export default class OpenCard extends React.Component{

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {

        var leftShift = 0
        var topShift = 0
        var zindex = this.props.index

        if(this.props.cardOnTable==='1') {
            if(this.props.index === 1){
                leftShift = 97
                topShift = 200 + 40
            } else if(this.props.index === 2){
                 leftShift = 97 + 35
                 topShift = 200
            } else if(this.props.index === 3){
                 leftShift = 97
                 topShift = 200 - 40
            }else if(this.props.index === 4){
                 leftShift = 97 - 35
                 topShift = 200
            }
        } else {
             leftShift = this.props.index * 22
            if(this.props.selectedCard === this.props.cardId.substring(5)){
                 topShift = -this.props.index * 100 - 38
            } else {
                 topShift = -this.props.index * 100
            }
            
        }

        return (
            <div 
                className="open-card" 
                onClick={this.props.onClick}
                cardId={this.props.cardId}
                index={this.props.index}
                selectedCard={this.props.selectedCard}
                cardOnTable={this.props.cardOnTable}
                style={{
                    zIndex: zindex, 
                    //left: this.props.cardOnTable ? leftShift : this.props.index*22, 
                    //top:  this.props.cardOnTable ? topShift : (-this.props.index*100 - 38 * (this.props.selectedCard === this.props.cardId.substring(5) ? 1 : 0))
                    left: leftShift,
                    top: topShift
                }}
            ></div>
        )
    }
}
