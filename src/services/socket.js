import { Manager } from 'socket.io-client';

const socketHost = 'http://127.0.0.1'
const socketPort = '5002'

const manager = new Manager(socketHost + ':' + socketPort)

const lobbySocket = manager.socket("/lobby", {autoConnect : false});
const roomSocket = manager.socket("/room", {autoConnect : false});
const gameSocket = manager.socket("/game", {autoConnect : false});

export { lobbySocket, roomSocket, gameSocket }