import { actions } from './features/Messages/redux';
import { SocketIOInterface } from './io';
import { WebSocketInterface } from './websocket';
import { socket } from './saga';

export function initWebsocket(url: string) {
  const websocket = new WebSocketInterface<{ message: string }>(url);

  socket.init(websocket);
  socket.subscribe(({ message }) => actions.websocketMessage(message));
  socket.connect();
}

export function initIO(url: string) {
  const io = new SocketIOInterface<{ message: string }>(url);

  socket.init(io);
  socket.connect();
  socket.subscribe(({ message }) => actions.ioMessage(message));
}

export const startWebsocket = () => initWebsocket('ws://localhost:5000');
export const startIO = () => initIO('http://localhost:5001');
