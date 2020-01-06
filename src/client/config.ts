import { socket } from './saga';
import { SocketIOInterface } from './socketIO';
import { WebSocketInterface } from './websocket';

const websocketConverter = (event: MessageEvent) => {
  const data = JSON.parse(event.data);

  return {
    type: 'WEBSOCKET:MESSAGE',
    payload: data
  };
};

const IOConverter = (data: any) => {
  return {
    type: 'IO:MESSAGE',
    payload: data
  };
};

const websocket = new WebSocketInterface('ws://localhost:5000');
const io = new SocketIOInterface('http://localhost:5001');

function initWebsocket() {
  socket.addConverter(websocketConverter);
  socket.addSocketInterface(websocket);
}

function initIO() {
  socket.addConverter(IOConverter);
  socket.addSocketInterface(io);
}

export { initWebsocket, initIO };
