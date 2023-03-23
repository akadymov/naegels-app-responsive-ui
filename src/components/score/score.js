import React from 'react';

import './score.css';

export default class Score extends React.Component{

    render () {
        return(
            <div className="score-container">
                {!this.props.total ? 
                    <div className="bet-size-container">
                        <div className={`bet-size ${this.props.bonus ? 'bonus' : ''}`}>{this.props.betSize}</div>
                    </div>
                :
                    ''
                }
                <div className={`${this.props.total ? 'total-' : ''}score`}>{this.props.score}</div>
            </div>
        )
    }
}