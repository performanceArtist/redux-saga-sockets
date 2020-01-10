import { socket } from './saga';
import { SocketIOInterface, IOMessageToAction } from './io';
import { WebSocketInterface, websocketMessageToAction } from './websocket';

export function initWebsocket(url: string) {
  const websocket = new WebSocketInterface(url, websocketMessageToAction);

  socket.init(websocket);
}

export function initIO(url: string) {
  const io = new SocketIOInterface(url, IOMessageToAction);

  socket.init(io)
}

export const startWebsocket = () => initWebsocket('ws://localhost:5000');
export const startIO = () => initIO('http://localhost:5001');
