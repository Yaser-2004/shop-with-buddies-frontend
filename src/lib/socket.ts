import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_PUBLIC_BASEURL;

export const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false, // we'll connect manually when needed
});
