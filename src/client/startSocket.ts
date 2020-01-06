import { socket } from './saga';
import { SocketIOInterface } from './io';
import { WebSocketInterface } from './websocket';

export function initWebsocket(url: string) {
  const websocket = new WebSocketInterface(url);
  const websocketMessageToAction = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    return {
      type: 'WEBSOCKET:MESSAGE',
      payload: data
    };
  };

  socket.init(websocket, websocketMessageToAction);
}

export function initIO(url: string) {
  const io = new SocketIOInterface(url);
  const IOMessageToAction = (data: any) => {
    return {
      type: 'IO:MESSAGE',
      payload: data
    };
  };

  socket.init(io, IOMessageToAction)
}

export const startWebsocket = () => initWebsocket('ws://localhost:5000');
export const startIO = () => initIO('http://localhost:5001');
