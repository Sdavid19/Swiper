import { io, Socket } from "socket.io-client";
import { API_URL } from "../api/client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = () => socket;