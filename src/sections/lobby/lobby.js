import React from 'react';

import './lobby.css';

//Local services
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';
import { roomSocket, lobbySocket } from '../../services/socket';

//Local components
import NaegelsTableContainer from '../../components/naegels-table-container';
import SectionHeader from '../../components/section-header';
import NaegelsModal from '../../components/naegels-modal';


export default class Lobby extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            roomsHeaders: ['Room', 'Host', 'Created', 'Players', 'Status'],
            rooms: [],
            selectedRoomId: -1,
            headerControls: [
                {
                    id: 'create_room',
                    type: 'button',
                    text: 'Create',
                    variant: 'contained',
                    disabled: false,
                    onSubmit: this.createRoomPopup
                },
                {
                    id: 'connect_to_room',
                    type: 'button',
                    text: 'Connect',
                    variant: 'contained',
                    disabled: true
                }
            ],
            modalOpen: false,
            modalControls: [
                {
                    id: "new_room_name_input",
                    type: "input",
                    variant: "outlined",
                    value: "",
                    errorMessage: "",
                    label: "room name",
                    onChange: this.handleNewRoomNameChange
                },
                {
                    id: "create_room_confirm_button",
                    type: "button",
                    variant: "contained",
                    text: "Create room",
                    disabled: true,
                    onSubmit: this.createNewRoom
                }
            ],
            newRoomName: '',
            newRoomError:'',
            popupError:'',
            confirmActionMsg:'',
            confirmAction:''
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

    GetRoomsList = () => {
        this.NaegelsApi.getRooms()
        .then((body) => {
            if(body.errors) {
                console.log('Something went wrong! Cannot get rooms list!')
            } else {
                const newRooms = []
                body.rooms.forEach(r => {
                    //TODO: format created timestamp (firstly, convert all dates to numbers in server responses)
                    r.id = r.roomId
                    r.valuesArray = [r.roomName, r.host, r.created, r.connectedUsers, r.status]
                    newRooms.push(r)
                });
                this.setState({rooms: newRooms})
            }
        });
    };

    updateControls = () => {
        var newHeaderControls = [
            {
                id: 'create_room',
                type: 'button',
                text: 'Create',
                variant: 'contained',
                disabled: false,
                onSubmit: this.createRoomPopup
            },
            {
                id: 'connect_to_room',
                type: 'button',
                text: 'Connect',
                variant: 'contained',
                disabled: this.state.selectedRoomId === -1,
                onSubmit: this.connectRoom
            }
        ]
        var newModalControls = [
            {
                id: "new_room_name_input",
                type: "input",
                value: this.state.newRoomName,
                label: "room name",
                onChange: this.handleNewRoomNameChange
            },
            {
                id: "create_room_confirm_button",
                type: "button",
                variant: "contained",
                text: "Create room",
                disabled: this.state.newRoomName === '',
                onSubmit: this.createNewRoom
            }
        ]
        this.setState({ 
            headerControls: newHeaderControls,
            modalControls: newModalControls
        })
    }

    connectRoom = (roomId) => {
        roomId = this.state.selectedRoomId
        this.NaegelsApi.connectRoom(this.Cookies.get('idToken'), roomId)
        .then((body) => {
            if(!body.errors){
                roomSocket.emit('add_player_to_room', this.Cookies.get('username'), roomId, body.roomName, body.connectedUsers)
                lobbySocket.emit('increase_room_players', this.Cookies.get('username'), roomId, body.roomName, body.connectedUsers)
                setTimeout(function(){
                    window.location.replace('/room/' + roomId)
                }, 1000)
            } else {
                this.setState({popupError: body.errors[0].message})
            }
        });
    };

    openRoom = (e) => {
        const roomId = e.target.id
        window.location.replace('/room/' + roomId)
    };

    handleCreateRoomError=(body) => {
        this.setState({newRoomError: body.errors[0].message});
    };
    
    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          this.createNewRoom();
        }
    };

    createRoomPopup = () => {
        this.setState({ 
            newRoomName: '',
            modalOpen: true
        })
    }

    createNewRoom = () => {
        this.closeModal()
        this.NaegelsApi.createRoom(this.Cookies.get('idToken'), this.state.newRoomName)
        .then((body) => {
            if(body.errors) {
                this.handleCreateRoomError(body)
            } else {
                lobbySocket.emit('create_room', body.roomId, body.roomName, body.host, body.created)
                window.location.replace('/room/' + body.roomId);
            }
        })
    };

    selectRoom = (event, roomId) => {
        var selectedRoomIndex = this.state.rooms.findIndex(room => room.roomId === roomId)
        if(selectedRoomIndex < 0){
            this.setState({ selectedRoomId: -1 }, () => {
                this.updateControls();
            })
        } else {
            this.setState({ selectedRoomId: roomId }, () => {
                this.updateControls();
            })
        }
    }

    handleNewRoomNameChange = (e) => {
        this.setState({ newRoomName: e.target.value }, () => {
            this.updateControls();
        })
    }

    closeModal = () => {
        this.setState({ 
            modalOpen: false,
            newRoomName: ''
        }, () => {
            this.updateControls();
        })
    }
    
    componentDidMount = () => {
        this.GetRoomsList();
    };

    render() {
      
        this.CheckIfLoggedIn();

        return(
            <div className={`lobby-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <SectionHeader
                    isMobile={this.props.isMobile}
                    isDesktop={this.props.isDesktop}
                    isPortrait={this.props.isPortrait}
                    controls={this.state.headerControls}
                ></SectionHeader>
                <div className={`lobby-table-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                    <NaegelsTableContainer
                        headers={this.state.roomsHeaders}
                        rows={this.state.rooms}
                        onClick={this.selectRoom}
                        selected={this.state.selectedRoomId}
                    ></NaegelsTableContainer>
                </div>
                <NaegelsModal
                    open={this.state.modalOpen}
                    header="New room"
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