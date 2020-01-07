import { socket } from './saga';
import { SocketIOInterface } from './io';
import { WebSocketInterface } from './websocket';
import { actions } from './features/Messages/redux';

const { websocketMessage, ioMessage } = actions;

export function initWebsocket(url: string) {
  const websocket = new WebSocketInterface(url);
  const websocketMessageToAction = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    return websocketMessage(data.message);
  };

  socket.init(websocket, websocketMessageToAction);
}

export function initIO(url: string) {
  const io = new SocketIOInterface(url);
  const IOMessageToAction = (data: any) => {
    return ioMessage(data.message);
  };

  socket.init(io, IOMessageToAction)
}

export const startWebsocket = () => initWebsocket('ws://localhost:5000');
export const startIO = () => initIO('http://localhost:5001');
