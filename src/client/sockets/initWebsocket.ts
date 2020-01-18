import { WebSocketInterface } from '../lib/adapters/websocket';
import { socket } from './socket';
import { SocketMessage, SocketChannel } from './types';

export function initWebsocket(url: string) {
  const websocket = new WebSocketInterface<SocketMessage, SocketChannel>({
    url,
    pickChannel: (data: SocketMessage, channel: SocketChannel) => data.type === channel
  });

  socket.init(websocket);
  socket.connect();
}

export function initNoChannelWebsocket(url: string) {
  const websocket = new WebSocketInterface<SocketMessage>({ url });

  socket.init(websocket);
  socket.connect();
}

export const startWebsocket = () => initWebsocket('ws://localhost:5000');
