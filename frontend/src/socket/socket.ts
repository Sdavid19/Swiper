import { io, Socket } from 'socket.io-client';
import { API_URL } from '../api/client';


export const socket = io(API_URL, {
  autoConnect: false,
  transports: ['websocket'],
});