import React from 'react';

import './table-put-cards.css';
import OpenCard from '../open-card';

export default class TablePutCards extends React.Component{

    constructor(props) {
        super(props);
    }
    
    render() {
        console.log(this.props)
        
        return (
            <div className={`table-put-cards-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                {this.props.cardsOnTable.map(card => {return(
                    <div className={`table-put-card player${card.playerRelativePosition} outof${this.props.playersCount}`}>
                        <OpenCard 
                            isMobile={this.props.isMobile}
                            isDesktop={this.props.isDesktop}
                            isPortrait={this.props.isPortrait}
                            cardId={'card-' + card.cardId}
                            index={this.props.cardsOnTable.findIndex( el => el === card )}
                            onTable={true}
                        ></OpenCard>
                    </div>
                    )})}
            </div>
        )
    }
}