import React from 'react';

import './game.css'

//Local services
import Cookies from 'universal-cookie';
import NaegelsApi from '../../services/naegels-api-service';
import { lobbySocket, roomSocket, gameSocket } from '../../services/socket';

//Local components
import SectionHeader from '../../components/section-header';
import PlayerContainer from '../../components/player-container';
import OpponentContainer from '../../components/opponent-container';
import NaegelsModal from '../../components/naegels-modal';

export default class Game extends React.Component{

    constructor(props) {
        super(props);this.handleBetChange = this.handleBetChange.bind(this);
        this.selectCard = this.selectCard.bind(this);
        this.state = {
            headerControls: [
                {
                    id: 'scores',
                    type: 'button',
                    text: 'Scores',
                    variant: 'contained',
                    disabled: false,
                    size: 'small',
                    width: '130px',
                    onSubmit: this.showScores
                },
                {
                    id: 'refresh',
                    type: 'button',
                    text: 'Refresh',
                    variant: 'contained',
                    disabled: false,
                    size: 'small',
                    width: '130px',
                    onSubmit: this.GetGameStatus
                },
                {
                    id: 'exit',
                    type: 'button',
                    text: 'Exit',
                    variant: 'contained',
                    disabled: false,
                    size: 'small',
                    width: '130px',
                    onSubmit: this.exitGame
                }
            ],
            modalControls: [],
            youAreHost: false,
            modalOpen: false,
            gameDetails: {
                players:[],
                canDeal: false,
                startedHands: [],
                gameScores: []
            },
            cardsInHand: [],
            myInhandInfo: {
                username: null,
                betSize: null,
                tookBets: null,
                cardsOnHand: null,
                dealer: false
            },
            myPosition: 0,
            popupError: '',
            confirmAction: '',
            confirmActionMsg: '',
            myBetSizeValue: 0,
            handDetails: {
                players: [],
                nextActingPlayer: '',
                cardsOnTable: []
            },
            selectedCard: ''
        }
    };

    Cookies = new Cookies();
    NaegelsApi = new NaegelsApi();

    CheckIfAlreadyLoggedIn = () => {
        const idToken = this.Cookies.get('idToken')
        if(!idToken) {
            window.location.replace('/signin/expired');
        }
    }
    
    GetGameStatus = () => {
        console.log('updating game status')
        this.NaegelsApi.getGame(this.props.match.params.gameId)
        .then((body) => {
            if(body.errors) {
                this.setState({
                    actionMessage: body.errors[0].message,
                    error: true
                })
            } else {
                this.setState({gameDetails: body}, () => {
                    if(this.Cookies.get('username') === body.host) {
                        this.setState({ youAreHost: true })
                    }
                })
                if(this.state.gameDetails.currentHandId) {
                    // get inhand players data
                    this.NaegelsApi.getHand(this.state.gameDetails.gameId, this.state.gameDetails.currentHandId, this.Cookies.get('idToken'))
                    .then((body) => {
                        if(body.errors) {
                            this.setState({
                                actionMessage: body.errors[0].message,
                                error: true
                            })
                        } else {
                            this.setState({handDetails: body})
                            var newGameDetails = this.state.gameDetails
                            newGameDetails.players.forEach(player => {
                                var handPlayerIndex = this.state.handDetails.players.findIndex(handPlayer => handPlayer.username === player.username)
                                var gamePlayerIndex = newGameDetails.players.findIndex(gamePlayer => gamePlayer.username === player.username)
                                newGameDetails.players[gamePlayerIndex].betSize = this.state.handDetails.players[handPlayerIndex].betSize
                                newGameDetails.players[gamePlayerIndex].tookBets = this.state.handDetails.players[handPlayerIndex].tookBets
                            });
                            const myIndex = this.state.handDetails.players.findIndex(handPlayer => handPlayer.username === this.Cookies.get('username'))
                            this.setState({myInhandInfo: this.state.handDetails.players[myIndex]})
                            this.setState({gameDetails: newGameDetails})
                            
                        }
                    });
                    // get cards on my hand
                    var playerIndex = this.state.gameDetails.players.findIndex(element => element.username === this.Cookies.get('username') )
                    if(playerIndex>=0 && this.state.gameDetails.currentHandId){
                        this.NaegelsApi.getCards(this.Cookies.get('idToken'), this.state.gameDetails.gameId, this.state.gameDetails.currentHandId)
                        .then((body) => {
                            if(body.errors) {
                                this.setState({
                                    actionMessage: body.errors[0].message,
                                    error: true
                                })
                            } else {
                                this.setState({
                                    cardsInHand: body.cardsInHand,
                                    myPosition: body.myPosition
                                })
                            }
                        })
                    }
                }
            }
        })
        .then(() =>{this.updateControls()}
        );
    };

    updateControls = () => {
        console.log('updating controls')
        var newHeaderControls = [
            {
                id: 'scores',
                type: 'button',
                text: 'Scores',
                variant: 'contained',
                disabled: false,
                size: 'small',
                width: '130px',
                onSubmit: this.showScores
            },
            {
                id: 'refresh',
                type: 'button',
                text: 'Refresh',
                variant: 'contained',
                disabled: false,
                size: 'small',
                width: '130px',
                onSubmit: this.GetGameStatus
            },
            {
                id: 'exit',
                type: 'button',
                text: this.state.youAreHost ? 'Finish' : 'Exit',
                variant: 'contained',
                disabled: false,
                size: 'small',
                width: '130px',
                onSubmit: this.state.youAreHost ? this.finishGame : this.exitGame
            }
        ]
        if (this.state.youAreHost){
            newHeaderControls.push({
                id: 'shuffle',
                type: 'button',
                text: 'Shuffle',
                variant: 'contained',
                disabled: this.state.gameDetails.positionsDefined,
                size: 'small',
                width: '130px',
                onSubmit: this.definePositions
            })
            newHeaderControls.push({
                id: 'deal',
                type: 'button',
                text: 'Deal',
                variant: 'contained',
                disabled: !this.state.gameDetails.canDeal,
                size: 'small',
                width: '130px',
                onSubmit: this.dealCards
            })
        }
        this.setState({ headerControls: newHeaderControls })
    }

    finishGame = () => {
        var newModalControls = [
            {
                id: "confirm_finish_game",
                type: "button",
                variant: "contained",
                text: "Finish game",
                width: '140px',
                disabled: false,
                onSubmit: this.confirmFinishGame
            },
            {
                id: "cancel_finish_game",
                type: "button",
                variant: "outlined",
                text: "Cancel",
                width: '140px',
                disabled: false,
                onSubmit: this.closeModal
            }
        ]
        this.setState({
            modalControls: newModalControls,
            modalOpen: true
        })
    }


    closeModal = () => {
        this.setState({ 
            modalOpen: false 
        })
    }

    confirmFinishGame = () => {
        const gameId = this.state.gameDetails.id
        const roomId = this.state.gameDetails.roomId
        this.NaegelsApi.finishGame(this.Cookies.get('idToken'))
        .then((body) => {
            if(body.errors){
                this.setState({popupError: body.errors[0].message})
            } else {
                gameSocket.emit('finish_game', this.Cookies.get('username'), gameId);
                this.setState({popupError: 'Game #' + gameId + ' was successfully finished!'})
                setTimeout(function(){
                    window.location.replace('/room/' + roomId)
                }, 1000)
            }
        });
    }

    dealCards = () => {
        this.NaegelsApi.dealCards(this.props.match.params.gameId, this.Cookies.get('idToken'))
        .then((body) => {
            if(body.errors) {
                this.setState({
                    actionMessage: body.errors[0].message,
                    error: true
                })
            } else{
                gameSocket.emit('deal_cards', this.props.match.params.gameId)
                this.GetGameStatus();
            }
        });
    };

    makeBet = () => {
        this.NaegelsApi.makeBet(this.Cookies.get('idToken'), this.state.gameDetails.gameId, this.state.gameDetails.currentHandId, parseInt(this.state.myBetSizeValue,10))
        .then((body) => {
            if(body.errors) {
                this.setState({
                    actionMessage: body.errors[0].message,
                    error: true
                })
            } else{
                gameSocket.emit(
                    'make_bet', 
                    this.props.match.params.gameId,
                    this.state.gameDetails.currentHandId, 
                    this.Cookies.get('username'), 
                    parseInt(this.state.myBetSizeValue,10),
                    body.nextPlayerToBet
                )
                if(body.nextPlayerToBet) {
                    var myInhandInfoNew = this.state.myInhandInfo
                    myInhandInfoNew.betSize = parseInt(this.state.myBetSizeValue,10)
                    var handDetailsNew = this.state.handDetails
                    handDetailsNew.nextActingPlayer = body.nextPlayerToBet
                    this.setState({ 
                        myInhandInfoNew: myInhandInfoNew,
                        handDetails: handDetailsNew 
                    })    
                } else {
                    gameSocket.emit(
                        'next_turn',
                        this.props.match.params.gameId,
                        this.state.gameDetails.currentHandId, 
                        this.Cookies.get('username')
                    )
                    this.GetGameStatus();
                }
            }
        });
    };

    definePositions = () => {
        this.NaegelsApi.definePositions(this.props.match.params.gameId, this.Cookies.get('idToken'))
        .then((body) => {
            var newGameDetails = this.state.gameDetails
            if(body.errors) {
                newGameDetails.actionMessage = body.errors[0].message
                this.setState({
                    gameDetails: newGameDetails
                })
            } else {
                gameSocket.emit('define_positions', this.props.match.params.gameId, body.players)
                newGameDetails.positionsDefined = true
                newGameDetails.canDeal = true
                newGameDetails.players = body.players
                this.setState({ gameDetails: newGameDetails })
            }
        });
    };

    selectCard = (cardId) => {
        
        if( cardId !== this.state.selectedCard) {
            this.setState({
                selectedCard: cardId
            })
        } else {
            this.NaegelsApi.putCard(
                this.Cookies.get('idToken'),
                this.state.gameDetails.gameId,
                this.state.gameDetails.currentHandId,
                cardId
            )
            .then((body) => {
                if(body.errors) {
                    this.setState({
                        actionMessage: body.errors[0].message,
                        error: true
                    })
                } else {
                    gameSocket.emit(
                        'next_turn', 
                        this.props.match.params.gameId,
                        this.state.gameDetails.currentHandId,
                        this.Cookies.get('username')
                    )
                    this.GetGameStatus();
                }
            })
        }
    }

    handleBetChange(e) {
        this.setState({myBetSizeValue: e.target.value})
    };

    exitGame = () => {
        var newModalControls = [
            {
                id: "confirm_exit_game",
                type: "button",
                variant: "contained",
                text: "Exit game",
                width: '140px',
                disabled: false,
                onSubmit: this.confirmExit
            },
            {
                id: "cancel_exit_game",
                type: "button",
                variant: "outlined",
                text: "Cancel",
                width: '140px',
                disabled: false,
                onSubmit: this.closeModal
            }
        ]
        this.setState({
            modalControls: newModalControls,
            modalOpen: true
        })
    }

    confirmExit = () => {
        const roomId = this.state.gameDetails.roomId
        const roomName = this.state.gameDetails.roomName
        const username = this.Cookies.get('username')
        this.NaegelsApi.disconnectRoom(this.Cookies.get('idToken'), roomId, username)
        .then((body) => {
            if(!body.errors){
                roomSocket.emit('remove_player_from_room', this.Cookies.get('username'), username, roomId, roomName, body.connectedUsers)
                lobbySocket.emit('decrease_room_players', this.Cookies.get('username'), username, roomId, roomName, body.connectedUsers)
                window.location.replace('/lobby')
            } else {
                this.setState({popupError: body.errors[0].message})
            }
        });
    }

    onSelectCard = (e) => {
        const cardId = e.target.getAttribute('cardId').substring(5)
        console.log('selecting card ' + cardId)
        if(this.state.handDetails.nextActingPlayer === this.state.myInhandInfo.username && this.state.handDetails.betsAreMade) {
            this.selectCard(cardId)
        }
    }
    
    componentDidMount = () => {
        this.GetGameStatus();
    }

    /*componentDidUpdate = () => {
        if(this.state.handDetails.cardsOnTable.length === this.state.gameDetails.players.length){
            console.log(this.state.handDetails)
            var newHandDetails = this.state.handDetails
            setTimeout(function(){
                newHandDetails.cardsOnTable = []
                this.setState({ handDetails: newHandDetails })
            }.bind(this), 3000)
        }
    }*/


    render() {

        console.log(this.state)

        const players = this.state.handDetails.players.length > 0 ? this.state.handDetails.players : this.state.gameDetails.players
        const myPosition = this.state.myPosition === 0 ? 1 : this.state.myPosition

        return (
            <div className={`game-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <SectionHeader
                    isMobile={this.props.isMobile}
                    isDesktop={this.props.isDesktop}
                    isPortrait={this.props.isPortrait}
                    controls={this.state.headerControls}
                    title={this.state.gameDetails.roomName}
                    subtitle={this.state.gameDetails.host}
                ></SectionHeader>
                <div className={`game-table ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    {
                    players.map(player => {
                        if(player.username !== this.Cookies.get('username')) {
                            if(this.state.gameDetails.positionsDefined){
                                return (
                                    <OpponentContainer
                                        key={`player ${player.position} conrainer`}
                                        isMobile={this.props.isMobile}
                                        isDesktop={this.props.isDesktop}
                                        isPortrait={this.props.isPortrait}
                                        cards={player.cardsOnHand}
                                        numberOfPlayers={players.length}
                                        username={player.username}
                                        position={((players.length + player.position - myPosition) % players.length)}
                                        betSize={player.betSize}
                                        tookBets={player.tookBets}
                                        active={this.state.handDetails.nextActingPlayer === player.username}
                                    ></OpponentContainer>
                                )
                            }
                        }
                    })}
                    {this.state.gameDetails.positionsDefined ? 
                        <PlayerContainer
                            isMobile={this.props.isMobile}
                            isDesktop={this.props.isDesktop}
                            isPortrait={this.props.isPortrait}
                            username={this.state.myInhandInfo.username}
                            betSize={this.state.myInhandInfo.betSize}
                            tookBets={this.state.myInhandInfo.tookBets}
                            active={this.state.myInhandInfo.username === this.state.handDetails.nextActingPlayer}
                            cardsInHand={this.state.cardsInHand}
                            selectedCard={this.state.selectedCard}
                            onClick={this.onSelectCard}
                        ></PlayerContainer>
                    :
                        ''
                    }
                    
                </div>
                <NaegelsModal
                    open={this.state.modalOpen}
                    text="Please, confirm action"
                    isMobile={this.props.isMobile}
                    isDesktop={this.props.isDesktop}
                    isPortrait={this.props.isPortrait}
                    controls={this.state.modalControls}
                    closeModal={this.closeModal}
                ></NaegelsModal>
            </div>
        )
    }
}