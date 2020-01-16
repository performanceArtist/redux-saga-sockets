import EventEmitter from 'events';
import io from 'socket.io-client';
import { autobind } from 'core-decorators';

import { AnySocket } from '../socket';

class SocketIOInterface<T, C extends string = never> implements AnySocket<T, C> {
  private socket!: SocketIOClient.Socket;
  private messsageEmitter = new EventEmitter();

  constructor(private url: string, private converter?: (data: any) => T) {
    this.socket = io(this.url);
  }

  public onConnect(resolve: () => void) {
    this.socket.on('connect', resolve);
  }

  @autobind
  public onMessage(handler: any) {
    this.messsageEmitter.on('message', handler);
  }

  @autobind
  public offMessage(handler: any) {
    this.messsageEmitter.off('message', handler);
  }

  public onReconnect(resolve: () => void) {
    this.socket.on('reconnect', resolve);
  }

  public onDisconnect(resolve: () => void) {
    this.socket.on('disconnect', resolve);
  }

  public subscribe(handler: (message: T) => void, channel?: C) {
    this.socket.on(channel || '*', (data: any) => {
      const converted = this.converter
        ? handler(this.converter(data))
        : handler(data);

      this.messsageEmitter.emit('message', converted);
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
