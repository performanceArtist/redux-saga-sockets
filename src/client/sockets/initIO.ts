import { SocketIOInterface } from '../lib/adapters/io';
import { socket } from './socket';
import { SocketMessage, SocketChannel } from './types';

export function initIO(url: string) {
  const io = new SocketIOInterface<SocketMessage, SocketChannel>(url);

  socket.init(io);
  socket.connect();
}

export function initNoChannelIO(url: string) {
  const io = new SocketIOInterface<SocketMessage>(url);

  socket.init(io);
  socket.connect();
}

export const startIO = () => initIO('http://localhost:5001');
