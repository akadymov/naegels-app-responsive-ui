import React from 'react';

import './room.css'

//Local services
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';
import { roomSocket, lobbySocket } from '../../services/socket';

//Local components
import NaegelsTableContainer from '../../components/naegels-table-container';
import SectionHeader from '../../components/section-header';
import NaegelsModal from '../../components/naegels-modal';


export default class Room extends React.Component{

    constructor(props) {
        super(props);
        this.handleReadySwitchChange = this.handleReadySwitchChange.bind(this);
        this.state = {
            playerHeaders: this.props.isMobile && this.props.isPortrait ? ['Player', 'Ready',''] : ['Player','Ready','','Overall rating'],
            players: [],
            modalOpen: false,
            modalControls: [
                {
                    id: "confirm_close_room",
                    type: "button",
                    variant: "contained",
                    text: "Close room",
                    width: '140px',
                    disabled: false,
                    onSubmit: this.confirmCloseRoom
                },
                {
                    id: "cancel_close_room",
                    type: "button",
                    variant: "outlined",
                    text: "Cancel",
                    width: '140px',
                    disabled: false,
                    onSubmit: this.closeModal
                }
            ],
            roomDetails: {
                connectedUserList: [],
                host: '',
                status: 'open',
                games: []
            },
            headerControls: [
                {
                    id: 'start_game',
                    type: 'button',
                    text: 'Start',
                    variant: 'contained',
                    disabled: true,
                    width: '130px',
                    onSubmit: this.startGame
                },
                {
                    id: 'close_room',
                    type: 'button',
                    text: 'Close',
                    variant: 'contained',
                    disabled: true,
                    width: '130px',
                    onSubmit: this.closeRoom
                }
            ],
            selectedPlayerId: -1,
            selectedPlayerUsername: '',
            selectedPlayerReady: -1,
            startGameError: '',
            popupError: '',
            confirmActionMsg:'',
            confirmAction:'',
            youAreHost: false,
            nextUrl: ''
        }
    }

    NaegelsApi = new NaegelsApi();
    Cookies = new Cookies();

    CheckIfLoggedIn = () => {
        const idToken = this.Cookies.get('idToken')
        if(!idToken) {
            window.location.replace('/signin/');
        }
    };

    updatePlayersTable = () => {
        var newPlayers = []
        var dataArray = []
        this.state.roomDetails.connectedUserList.map((player, index) => {
                dataArray = [
                    {
                        type: 'player',
                        username: player.username,
                        host: player.username === this.state.roomDetails.host
                    },
                    {
                        type:'switch',
                        checked: player.ready,
                        disabled: this.Cookies.get('username') !== this.state.roomDetails.host && player.username !== this.Cookies.get('username'),
                        username: player.username,
                        onChange: this.handleReadySwitchChange.bind(this, index)
                    },
                    {
                        type: 'button',
                        variant: 'contained',
                        text: 'Disconnect',
                        onSubmit: this.disconnectRoom.bind(this, index),
                        size: 'small',
                        color: 'error',
                        disabled: this.Cookies.get('username') !== this.state.roomDetails.host && player.username !== this.Cookies.get('username')
                    }
                ]
                if(!(this.props.isMobile && this.props.isPortrait)) {
                    dataArray.push({
                        type: 'text',
                        value: player.rating
                    })
                }
                newPlayers.push({
                    id: player.id,
                    username: player.username,
                    dataArray: dataArray
                })
            
        })
        this.setState({ players: newPlayers })
    }

    selectPlayer = (event, playerId) => {
        var selectedPlayerIndex = this.state.roomDetails.connectedUserList.findIndex(player => player.id === playerId)
        if(selectedPlayerIndex < 0){
            this.setState({ selectedPlayerId: -1 }, () => {
                this.updateControls();
            })
        } else {
            this.setState({
                selectedPlayerId: playerId,
                selectedPlayerUsername: this.state.roomDetails.connectedUserList[selectedPlayerIndex].username,
                selectedPlayerReady: this.state.roomDetails.connectedUserList[selectedPlayerIndex].ready
            }, () => {
                this.updateControls();
            })
        }
    }

    updateControls = () => {
        var newHeaderControls = []
        newHeaderControls.push({
            id: 'start_game',
            type: 'button',
            text: 'Start',
            variant: 'contained',
            size: 'small',
            disabled: !this.state.youAreHost,
            width: '130px',
            onSubmit: this.startGame
        })
        newHeaderControls.push({
            id: 'close_room',
            type: 'button',
            text: 'Close',
            variant: 'contained',
            size: 'small',
            disabled: !this.state.youAreHost,
            width: '130px',
            onSubmit: this.closeRoom
        })
        this.setState({ headerControls: newHeaderControls })
    }
    

    GetRoomDetails = () => {
        this.NaegelsApi.getRoom(this.props.match.params.roomId)
        .then((body) => {
            if(body.errors) {
                console.log('Something went wrong! Cannot get rooms list!')
            } else {
                this.setState({roomDetails: body}, () => {
                    this.updatePlayersTable()
                    this.updateControls()
                })
                if(body.host === this.Cookies.get('username')) {
                    this.setState({youAreHost: true}, () => {
                        this.updateControls()
                    })
                }
                if(this.state.roomDetails.status === 'closed') {
                    window.location.replace('/lobby')
                }
            }
        });
    };

    disconnectRoom = (playerIndex) => {
        const username = this.state.players[playerIndex].username
        const roomId = this.state.roomDetails.roomId
        const roomName = this.state.roomDetails.roomName
        //if(username===this.state.roomDetails.host){
        //    this.setState({
        //        confirmActionMsg: 'Are you sure you want to leave room? It will be closed since you are host',
        //        confirmAction: this.confirmCloseRoom
        //    })
        //}
        this.NaegelsApi.disconnectRoom(this.Cookies.get('idToken'), roomId, username)
        .then((body) => {
            if(!body.errors){
                roomSocket.emit('remove_player_from_room', this.Cookies.get('username'), username, roomId, roomName, body.connectedUsers)
                lobbySocket.emit('decrease_room_players', this.Cookies.get('username'), username, roomId, roomName, body.connectedUsers)
                if(username === this.Cookies.get('username')){
                    window.location.replace('/lobby')
                } else {
                    var newRoomDetails = this.state.roomDetails
                    var disconnectedUserIndex = newRoomDetails.connectedUserList.findIndex(element => element.username === username )
                    if (disconnectedUserIndex >= 0){
                        newRoomDetails.connectedUserList.splice(disconnectedUserIndex,1)
                        this.setState({ roomDetails: newRoomDetails })
                    }
                }
            } else {
                this.setState({popupError: body.errors[0].message})
            }
        });
    }

    confirmReady = (username = this.state.selectedPlayerUsername ? this.state.selectedPlayerUsername : this.Cookies.get('username')) => {
        const roomId = this.state.roomDetails.roomId
        this.NaegelsApi.confirmReady(this.Cookies.get('idToken'), roomId, username)
        .then((body) => {
            if(!body.errors){
                var newRoomDetails = this.state.roomDetails
                var targetUserUpdated = newRoomDetails.connectedUserList.findIndex(element => element.username === username )
                newRoomDetails.connectedUserList[targetUserUpdated].ready = 1
                this.setState({roomDetails: newRoomDetails})
                roomSocket.emit('ready', this.Cookies.get('username'), username, roomId)
            } else {
                this.setState({popupError: body.errors[0].message})
            }
        });
    }

    resetReady = (username = this.state.selectedPlayerUsername ? this.state.selectedPlayerUsername : this.Cookies.get('username')) => {
        const roomId = this.state.roomDetails.roomId
        this.NaegelsApi.resetReady(this.Cookies.get('idToken'), roomId, username)
        .then((body) => {
            if(!body.errors){
                var newRoomDetails = this.state.roomDetails
                var targetUserUpdated = newRoomDetails.connectedUserList.findIndex(element => element.username === username )
                newRoomDetails.connectedUserList[targetUserUpdated].ready = 0
                this.setState({roomDetails: newRoomDetails})
                roomSocket.emit('not_ready', this.Cookies.get('username'), username, roomId)
            } else {
                this.setState({popupError: body.errors[0].message})
            }
        });
    }

    handleReadySwitchChange = (playerIndex) => {
        var newPlayers = this.state.players
        newPlayers[playerIndex].ready = !newPlayers[playerIndex].ready
        if (!newPlayers[playerIndex].ready) {
            this.confirmReady(newPlayers[playerIndex].username)
            this.setState({players: newPlayers})
        } else {
            this.resetReady(newPlayers[playerIndex].username)
            this.setState({players: newPlayers})
        }
    }

    closeRoom = () => {
        this.setState({
            modalOpen: true
        })
    }

    closeModal = () => {
        this.setState({ 
            modalOpen: false 
        })
    }

    confirmCloseRoom = () => {
        const roomId = this.state.roomDetails.roomId
        const roomName = this.state.roomDetails.roomName
        this.NaegelsApi.closeRoom(this.Cookies.get('idToken'), roomId)
        .then((body) => {
            if(body.errors){
                this.setState({popupError: body.errors[0].message})
            } else {
                roomSocket.emit('close_room', this.Cookies.get('username'), roomName);
                lobbySocket.emit('remove_room_from_lobby', roomName);
                this.setState({popupError: 'Room "' + roomName + '" was successfully closed!'})
                setTimeout(function(){
                    window.location.replace('/lobby' + roomId)
                }, 1000)
            }
        });
    }

    startGame = () => {
        this.NaegelsApi.startGame(this.Cookies.get('idToken'))
        .then((body) => {
            if(body.errors) {
                this.setState({popupError: body.errors[0].message})
            } else {
                roomSocket.emit('start_game_in_room', this.Cookies.get('username'), body.gameId, this.props.match.params.roomId)
                setTimeout(function(){
                    window.location.replace('/game/' + body.gameId)
                }, 1000)
            }
        })
    }
    
    componentDidMount = () => {
        this.GetRoomDetails();
    };

    render() {
      
        this.CheckIfLoggedIn();

        return(
            <div className={`room-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <SectionHeader
                    isMobile={this.props.isMobile}
                    isDesktop={this.props.isDesktop}
                    isPortrait={this.props.isPortrait}
                    controls={this.state.headerControls}
                ></SectionHeader>
                <div className={`room-table-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    <NaegelsTableContainer
                        height={this.props.isMobile ? (this.props.isPortrait ? '74vh' : '88vh') : '90vh'}
                        headers={this.state.playerHeaders}
                        rows={this.state.players}
                        onClick={this.selectPlayer}
                        selected={this.state.selectedPlayerId}
                    ></NaegelsTableContainer>
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