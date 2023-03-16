import React from 'react';

import './lobby.css'

//Local services
import NaegelsApi from '../../services/naegels-api-service';
import Cookies from 'universal-cookie';
import { roomSocket, lobbySocket } from '../../services/socket';

//Local components
import NaegelsTableContainer from '../../components/naegels-table-container';


export default class RegistrationSucceed extends React.Component{

    constructor(props) {
        super(props);
        this.GetRoomsList = this.GetRoomsList.bind(this);
        this.state = {
            headers: ['Room', 'Host', 'Created', 'Players', 'Status'],
            rooms: [],
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

    connectRoom = (e) => {
        // debugger;
        const roomId = e.target.id
        this.NaegelsApi.connectRoom(this.Cookies.get('idToken'), roomId)
        .then((body) => {
            if(!body.errors){
                roomSocket.emit('add_player_to_room', this.Cookies.get('username'), roomId, body.roomName, body.connectedUsers)
                lobbySocket.emit('increase_room_players', this.Cookies.get('username'), roomId, body.roomName, body.connectedUsers)
                console.log('connect_to_room')
                setTimeout(function(){
                    window.location.replace('/lobby/room/' + roomId)
                }, 1000)
            } else {
                this.setState({popupError: body.errors[0].message})
            }
        });
    };

    openRoom = (e) => {
        const roomId = e.target.id
        window.location.replace('/lobby/room/' + roomId)
    };

    handleNewRoomNameChange = (e) => {
        this.setState({ newRoomName: e.target.value })
    };

    handleCreateRoomError=(body) => {
        this.setState({newRoomError: body.errors[0].message});
    };
    
    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          this.createNewRoom();
        }
    };

    createNewRoom = () => {
        this.NaegelsApi.createRoom(this.Cookies.get('idToken'), this.state.newRoomName)
        .then((body) => {
            if(body.errors) {
                this.handleCreateRoomError(body)
            } else {
                lobbySocket.emit('create_room', body.roomId, body.roomName, body.host, body.created)
                console.log('create_room')
                window.location.replace('/lobby/room/' + body.roomId);
            }
        })
    };
    
    componentWillMount = () => {
        this.GetRoomsList();
    };

    render() {
      
        this.CheckIfLoggedIn();

        return(
            <div className={`lobby-container ${ this.props.isMobile ? "mobile" : (this.props.isDesktop ? "desktop" : "tablet")} ${ this.props.isPortrait ? "portrait" : "landscape"}`}>
                <NaegelsTableContainer
                    headers={this.state.headers}
                    rows={this.state.rooms}
                ></NaegelsTableContainer>
            </div>
        )
    }
}