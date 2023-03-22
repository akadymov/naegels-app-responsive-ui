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
            roomsHeaders:  this.props.isMobile && this.props.isPortrait ? ['Room', 'Host', 'Players', ''] : ['Room', 'Host', 'Players', 'Created', 'Status', ''],
            rooms: [],
            selectedRoomId: -1,
            headerControls: [
                {
                    id: 'refresh_lobby',
                    type: 'button',
                    text: 'Refresh',
                    variant: 'contained',
                    disabled: false,
                    width: '130px',
                    onSubmit: this.GetRoomsList
                },
                {
                    id: 'create_room',
                    type: 'button',
                    text: 'Create',
                    variant: 'contained',
                    disabled: false,
                    width: '130px',
                    onSubmit: this.createRoomPopup
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
        this.NaegelsApi.getRooms(this.Cookies.get('idToken'))
        .then((body) => {
            if(body.errors) {
                console.log('Something went wrong! Cannot get rooms list!')
            } else {
                const newRooms = []
                body.rooms.forEach((r, index) => {
                    //TODO: format created timestamp (firstly, convert all dates to numbers in server responses)
                    r.id = r.roomId
                    r.dataArray = [
                        {
                            type: 'text',
                            value: r.roomName
                        },
                        {
                            type: 'text',
                            value: r.host  
                        },
                        {
                            type: 'text',
                            value: r.connectedUsers + '/6'
                        }
                    ]
                    if (!(this.props.isMobile && this.props.isPortrait)){
                        r.dataArray.push({
                            type: 'text',
                            value: r.created
                        })
                        r.dataArray.push({
                            type: 'text',
                            value: r.status
                        })
                    }
                    r.dataArray.push({
                        type:'button',
                        variant: 'contained',
                        text: !body.myConnectedRoomId && r.status === 'open' ? 'Connect' : (body.myConnectedRoomId===r.id ? 'Open' : 'Watch'),
                        onSubmit: !body.myConnectedRoomId && r.status ? this.connectRoom.bind(this, r.roomId) : () => window.location.replace('/room/' + r.roomId),
                        width: '130px',
                        disabled: false
                    })
                    newRooms.push(r)
                });
                this.setState({
                    rooms: newRooms,
                    myConnectedRoomId: body.myConnectedRoomId
                }, () => {
                    this.updateControls()
                })
            }
        });
    };

    updateControls = () => {
        var newHeaderControls = [
            {
                id: 'refresh_lobby',
                type: 'button',
                text: 'Refresh',
                variant: 'contained',
                disabled: false,
                width: '130px',
                onSubmit: this.GetRoomsList
            },
            {
                id: 'create_room',
                type: 'button',
                text: 'Create',
                variant: 'contained',
                disabled: this.state.myConnectedRoomId > 0,
                width: '130px',
                onSubmit: this.createRoomPopup
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
        var newModalControls = this.state.modalControls
        newModalControls[0].errorMessage = body.errors[0].message
        this.setState({modalControls: newModalControls});
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

        lobbySocket.on('update_lobby', (data) => {
            var newRooms = {}
            var updatedRoomIndex = -1
            switch(true){
                case data.event = 'create':
                    var roomIsAlreadyDisplayed = this.state.rooms.findIndex(element => element.id === data.roomId )
                    if (roomIsAlreadyDisplayed < 0){
                        this.GetRoomsList()
                    }
                    break
                case data.event = 'close':
                    newRooms = this.state.rooms
                    updatedRoomIndex = newRooms.findIndex(element => element.id === data.roomId )
                    if (updatedRoomIndex >= 0) {
                        newRooms.splice(updatedRoomIndex, 1)
                        this.setState({rooms: newRooms})
                    }
                    break
                case ['connect', 'disconnect'].includes(data.event):
                    newRooms = this.state.rooms
                    updatedRoomIndex = newRooms.findIndex(element => element.id === data.roomId )
                    if (updatedRoomIndex > 0) {
                        newRooms[updatedRoomIndex].dataArray[2] = {
                            type: 'text',
                            value: data.connectedUsers + '/6'
                        }
                        this.setState({ rooms: newRooms })
                    }
                    break
                case data.event = 'start':
                case data.event = 'finish':
                    if(!this.props.isMobile || !this.props.isPortrait){
                        newRooms = this.state.rooms
                        updatedRoomIndex = newRooms.findIndex(element => element.id === data.roomId )
                        if (updatedRoomIndex > 0) {
                            newRooms[updatedRoomIndex].dataArray[4].value = data.newStatus
                        } else {
                            this.GetRoomsList()
                        }
                    }
                    break
                default:
                    console.log('Received nknown event "' + data.event + '" from lobby socket.')
                    break
            }
        })
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
                        height={this.props.isMobile ? (this.props.isPortrait ? '74vh' : '88vh') : '90vh'}
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
                    modalCanClose
                ></NaegelsModal>
            </div>
        )
    }
}