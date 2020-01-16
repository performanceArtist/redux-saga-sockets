import { actions } from './features/Messages/redux';
import { SocketIOInterface } from './io';
import { WebSocketInterface } from './websocket';
import { socket } from './saga';
import { SocketData, SocketChannel } from './socketTypes';

export function initWebsocket(url: string) {
  const websocket = new WebSocketInterface<SocketData, SocketChannel>({
    url,
    pickChannel: (data: SocketData, channel: SocketChannel) => data.type === channel
  });

  socket.init(websocket);
  socket.subscribe('one', data => actions.websocketMessage(`Type one: ${data.message}`));
  socket.subscribe('two', data => actions.websocketMessage(`Type two: ${data.message}`));
  socket.connect();
}

export function initIO(url: string) {
  const io = new SocketIOInterface<SocketData, SocketChannel>(url);

  socket.init(io);
  socket.subscribe('one', data => actions.ioMessage(`Type one: ${data.message}`));
  socket.subscribe('two', data => actions.ioMessage(`Type two: ${data.message}`));
  socket.connect();
}

export function initNoChannelWebsocket(url: string) {
  const websocket = new WebSocketInterface<SocketData>({ url });

  socket.init(websocket);
  socket.subscribe(data => actions.websocketMessage(`Any message: ${data.message}`));
  socket.connect();
}

export function initNoChannelIO(url: string) {
  const io = new SocketIOInterface<SocketData, SocketChannel>(url);

  socket.init(io);
  socket.subscribe(data => actions.ioMessage(`Any message: ${data.message}`));
  socket.connect();
}

export const startWebsocket = () => initWebsocket('ws://localhost:5000');
export const startIO = () => initIO('http://localhost:5001');
