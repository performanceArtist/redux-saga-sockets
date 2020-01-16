import EventEmitter from 'events';
import io from 'socket.io-client';
import { autobind } from 'core-decorators';

import { AnySocket } from '../socket';

class SocketIOInterface<T, C extends string = never> implements AnySocket<T, C> {
  private socket!: SocketIOClient.Socket;
  private emitter = new EventEmitter();

  constructor(private url: string, private converter?: (data: any) => T) {}

  public onConnect(resolve: () => void) {
    this.socket = io(this.url);
    this.socket.on('connect', resolve);
  }

  @autobind
  public onMessage(handler: any) {
    this.emitter.on('message', handler);
  }

  public onReconnect(resolve: () => void) {
    this.socket.on('reconnect', resolve);
  }

  public onDisconnect(resolve: () => void) {
    this.socket.on('disconnect', resolve);
  }

  public subscribe(handler: (message: T) => void, channel?: C) {
    this.socket.on(channel || 'message', (data: any) => {
      const converted = this.converter
        ? handler(this.converter(data))
        : handler(data);

      this.emitter.emit('message', converted);
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
