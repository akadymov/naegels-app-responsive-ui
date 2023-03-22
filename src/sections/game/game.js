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
import TableActionMessage from '../../components/table-action-message';
import TablePutCards from '../../components/table-put-cards';

export default class Game extends React.Component{

    constructor(props) {
        super(props);
        this.handleBetChange = this.handleBetChange.bind(this);
        this.selectCard = this.selectCard.bind(this);
        this.state = {
            gameDetails: {
                gameId: null,
                roomId: null,
                roomName: null,
                host: null,
                positionsDefined: false,
                canDeal: false,
                gameScores: [],
                nextActingPlayer: null,
                players: [],
                cardsOnTable: [],
                myInHandInfo: {
                    username: null,
                    betSize: null,
                    tookTurns: null,
                    dealtCards: [],
                    selectedCard: null
                }
            },
            headerControls: [],
            modalOpen: false,
            modalText: '',
            modalCanClose: false,
            modalControls: []
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

    handleApiError(responseWithErrors){
        console.log('REST API error:')
        responseWithErrors.errors.forEach(error => {
            console.log(error.message)
        })
    }

    newGameStatus = () => {
        // get game status
        console.log('updating game status')
        var newHeaderControls = []
        var newModalControls = []
        this.NaegelsApi.getGame(this.props.match.params.gameId, this.Cookies.get('idToken'))
        .then((getGameResponse) => {
            if(getGameResponse.errors){
                this.handleApiError(getGameResponse)
            } else {
                console.log('getting gameDetails')
                newHeaderControls = [
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
                        onSubmit: this.newGameStatus
                    },
                    {
                        id: 'exit',
                        type: 'button',
                        text: getGameResponse.host === this.Cookies.get('username') ? 'Finish' : 'Exit',
                        variant: 'contained',
                        disabled: false,
                        size: 'small',
                        width: '130px',
                        color: 'error',
                        onSubmit: getGameResponse.host === this.Cookies.get('username') ? this.finishGame : this.exitGame
                    }
                ]
                if (getGameResponse.host === this.Cookies.get('username')){
                    console.log('updating host controls')
                    newHeaderControls.push({
                        id: 'shuffle',
                        type: 'button',
                        text: 'Shuffle',
                        variant: 'contained',
                        disabled: getGameResponse.positionsDefined,
                        size: 'small',
                        width: '130px',
                        onSubmit: this.definePositions
                    })
                    newHeaderControls.push({
                        id: 'deal',
                        type: 'button',
                        text: 'Deal',
                        variant: 'contained',
                        disabled: !getGameResponse.canDeal,
                        size: 'small',
                        width: '130px',
                        onSubmit: this.dealCards
                    })
                }
                if(getGameResponse.nextActingPlayer === this.Cookies.get('username') && !getGameResponse.betsAreMade){
                    newModalControls = [
                        {
                            id: "bet_size_input",
                            type: "input",
                            textFormat: "number",
                            label: "bet size",
                            variant: "outlined",
                            value: this.state.myBetSizeValue,
                            errorMessage: "",
                            onChange: this.handleBetChange,
                            width: '5px',
                            defaultValue:0
                        },
                        {
                            id: "bet_size_confirm_button",
                            type: "button",
                            variant: "contained",
                            text: "Confirm",
                            onSubmit: this.makeBet
                        }
                    ]
                }
                this.setState({
                    gameDetails: getGameResponse,
                    headerControls: newHeaderControls,
                    modalControls: newModalControls,
                    modalOpen: getGameResponse.nextActingPlayer === this.Cookies.get('username') && !getGameResponse.betsAreMade,
                    modalText: "Make a bet",
                    modalCanClose: false
                })
            }
        })
    }

    finishGame = () => {
        var newModalControls = [
            {
                id: "confirm_finish_game",
                type: "button",
                variant: "contained",
                text: "Finish game",
                width: '140px',
                color: 'error',
                disabled: false,
                onSubmit: this.confirmFinishGame
            },
            {
                id: "cancel_finish_game",
                type: "button",
                variant: "contained",
                text: "Cancel",
                width: '140px',
                disabled: false,
                onSubmit: this.closeModal
            }
        ]
        this.setState({
            modalControls: newModalControls,
            modalOpen: true,
            modalText: "Please, confirm finishing the game",
            modalCanClose: true
        })
    }

    closeModal = () => {
        this.setState({ 
            modalControls: [],
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
                this.newGameStatus();
            }
        });
    };

    makeBet = () => {
        this.NaegelsApi.makeBet(this.Cookies.get('idToken'), this.state.gameDetails.gameId, this.state.gameDetails.currentHandId, parseInt(this.state.myBetSizeValue,10))
        .then((body) => {
            if(body.errors) {
                var newModalControls = this.state.modalControls
                newModalControls[0].errorMessage = body.errors[0].message
                this.setState({
                    modalControls: newModalControls
                })
            } else {
                gameSocket.emit(
                    'make_bet', 
                    this.props.match.params.gameId,
                    this.state.gameDetails.currentHandId, 
                    this.Cookies.get('username'), 
                    parseInt(this.state.myBetSizeValue,10),
                    body.nextPlayerToBet
                )
                    this.newGameStatus();
                }
            });
    };

    definePositions = () => {
        this.NaegelsApi.definePositions(this.props.match.params.gameId, this.Cookies.get('idToken'))
        .then((body) => {
            if(body.errors) {
                this.setState({popupError: body.errors[0].message})
            } else {
                gameSocket.emit('define_positions', this.props.match.params.gameId, body.players)
                this.newGameStatus()
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
                    this.newGameStatus();
                }
            })
        }
    }

    handleBetChange(e) {
        console.log(e.target)
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
                color: 'error',
                disabled: false,
                onSubmit: this.confirmExit
            },
            {
                id: "cancel_exit_game",
                type: "button",
                variant: "contained",
                text: "Cancel",
                width: '140px',
                disabled: false,
                onSubmit: this.closeModal
            }
        ]
        this.setState({
            modalControls: newModalControls,
            modalOpen: true,
            modalText: "Please, confirm exit",
            modalCanClose: true
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
        if(this.state.gameDetails.nextActingPlayer === this.state.gameDetails.myInHandInfo.username && this.state.gameDetails.betsAreMade) {
            this.selectCard(cardId)
        }
    }
    
    componentDidMount = () => {
        this.newGameStatus()
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
                        this.state.gameDetails.actionMessage ? 
                        <TableActionMessage
                            isMobile={this.props.isMobile}
                            isDesktop={this.props.isDesktop}
                            isPortrait={this.props.isPortrait}
                            message={this.state.gameDetails.actionMessage}
                        >
                        </TableActionMessage>
                        :
                            ''
                    }
                    {
                        this.state.gameDetails.cardsOnTable.length > 0 ?
                            <TablePutCards
                                isMobile={this.props.isMobile}
                                isDesktop={this.props.isDesktop}
                                isPortrait={this.props.isPortrait}
                                cardsOnTable={this.state.gameDetails.cardsOnTable}
                                playersCount={this.state.gameDetails.players.length}
                            ></TablePutCards>
                        :
                            ''
                    }
                    {
                    this.state.gameDetails.players.map(player => {
                        if(player.username !== this.Cookies.get('username')) {
                            if(this.state.gameDetails.positionsDefined){
                                return (
                                    <OpponentContainer
                                        key={`player ${player.position} conrainer`}
                                        isMobile={this.props.isMobile}
                                        isDesktop={this.props.isDesktop}
                                        isPortrait={this.props.isPortrait}
                                        cards={player.cardsOnHand}
                                        numberOfPlayers={this.state.gameDetails.players.length}
                                        username={player.username}
                                        position={player.relativePosition}
                                        betSize={player.betSize}
                                        tookTurns={player.tookTurns}
                                        active={this.state.gameDetails.nextActingPlayer === player.username}
                                    ></OpponentContainer>
                                )
                            }
                        }
                    })}
                    {this.state.gameDetails.positionsDefined && this.state.gameDetails.myInHandInfo ? 
                        <PlayerContainer
                            isMobile={this.props.isMobile}
                            isDesktop={this.props.isDesktop}
                            isPortrait={this.props.isPortrait}
                            username={this.state.gameDetails.myInHandInfo.username}
                            betSize={this.state.gameDetails.myInHandInfo.betSize}
                            tookTurns={this.state.gameDetails.myInHandInfo.tookTurns}
                            active={this.state.gameDetails.myInHandInfo.username === this.state.gameDetails.nextActingPlayer}
                            dealtCards={this.state.gameDetails.myInHandInfo.dealtCards}
                            selectedCard={this.state.selectedCard}
                            onSelectCard={this.onSelectCard}
                        ></PlayerContainer>
                    :
                        ''
                    }
                </div>
                <NaegelsModal
                    open={this.state.modalOpen}
                    text={this.state.modalText}
                    isMobile={this.props.isMobile}
                    isDesktop={this.props.isDesktop}
                    isPortrait={this.props.isPortrait}
                    controls={this.state.modalControls}
                    closeModal={this.closeModal}
                    modalCanClose={this.modalCanClose}
                ></NaegelsModal>
            </div>
        )
    }
}

