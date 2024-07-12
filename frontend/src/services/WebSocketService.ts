import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:3500', {
    transports: ['websocket'],
});

export default socket;