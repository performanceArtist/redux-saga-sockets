import io from 'socket.io-client';

import { AnySocket } from '../socket';

class SocketIOInterface<T> implements AnySocket<T> {
  private socket!: SocketIOClient.Socket;

  constructor(private url: string, private converter?: (data: any) => T) {}

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

  public subscribe(handler: (message: T) => void) {
    this.socket.on('message', (data: any) => {
      this.converter
        ? handler(this.converter(data))
        : handler(data);
    });
  }

  public unsubscribe(handler: (message: T) => void) {
    this.socket.off('message', handler);
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export { SocketIOInterface };
