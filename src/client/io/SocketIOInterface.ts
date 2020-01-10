import io from 'socket.io-client';

import { AnySocket, Converter } from '../socket';

class SocketIOInterface implements AnySocket<any> {
  private socket!: SocketIOClient.Socket;

  constructor(private url: string, public converter: Converter<any>) {}

  public onConnect(resolve: () => void) {
    this.socket = io(this.url);
    this.socket.on('connect', resolve);
  }

  public onReconnect(resolve: () => void) {
    this.socket.on('reconnect', resolve);
  }

  public onDisconnect(resolve: () => void) {
    this.socket.on('disconnect', resolve);
  }

  public subscribe(handler: (message: any) => void) {
    this.socket.on('message', handler);
  }

  public unsubscribe(handler: (message: MessageEvent) => void) {
    this.socket.off('message', handler);
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export { SocketIOInterface };
