import { EventEmitter } from 'events';
import { autobind } from 'core-decorators';

type EventHandler = (callback: () => void) => void;
export type AnySocket<T, C> = {
  onConnect: EventHandler;
  onDisconnect: EventHandler;
  onReconnect: EventHandler;
  onMessage?: (handler: (data: T) => void) => void;
  offMessage?: (handler: (data: T) => void) => void;
  disconnect: () => void;
  subscribe: (handler: (message: T) => void, channel?: C) => void;
  unsubscribe: (handler?: (message: T) => void, channel?: C) => void;
};

export type ToAction<T> = (data: T) => any;

class Socket<T, C = never> {
  private socket!: AnySocket<T, C>;
  private serverStatusEmitter = new EventEmitter();
  private lastServerStatus: 'on' | 'off' = 'off';
  private subscribeBuffer: [ToAction<T>, C?][] = [];
  public onMessage?: AnySocket<T, C>['onMessage'];
  public offMessage?: AnySocket<T, C>['offMessage'];

  public init(socket: AnySocket<T, C>) {
    this.socket && this.socket.disconnect();
    this.socket = socket;
    this.onMessage = socket.onMessage;
    this.offMessage = socket.offMessage;
    this.subscribeBuffer.forEach(pending => this.socket.subscribe(...pending));
    this.subscribeBuffer = [];
  }

  public subscribe(makeAction: ToAction<T>): void
  public subscribe(channel: C, makeAction: ToAction<T>): void
  subscribe(a: ToAction<T> | C, b?: ToAction<T>) {
    if (typeof a === 'string' && b) {
      this.socket
        ? this.socket.subscribe(b, a)
        : this.subscribeBuffer.push([b, a]);
    } else {
      this.socket
        ? this.socket.subscribe(a as ToAction<T>)
        : this.subscribeBuffer.push([a as ToAction<T>]);
    }
  }

  public unsubscribe(makeAction: ToAction<T>): void
  public unsubscribe(channel: C, makeAction: ToAction<T>): void
  unsubscribe(a: ToAction<T> | C, b?: ToAction<T>) {
    if (typeof a === 'string' && b) {
      this.socket
        ? this.socket.unsubscribe(b, a)
        : this.subscribeBuffer = this.subscribeBuffer.filter(
          ([action, channel]) => action !== b && channel !== a
        )
    } else {
      this.socket
        ? this.socket.unsubscribe(a as ToAction<T>)
        : this.subscribeBuffer = this.subscribeBuffer.filter(
          ([action, channel]) => action !== a && !channel
        )
    }
  }

  public onServerStatusChange(callback: (status: 'on' | 'off') => void) {
    this.serverStatusEmitter.on('serverStatusUpdate', callback);
  }

  public offServerStatusChange(callback: (status: 'on' | 'off') => void) {
    this.serverStatusEmitter.off('serverStatusUpdate', callback);
  }

  private sendServerStatusUpdate(status: 'on' | 'off') {
    if (this.lastServerStatus === status) {
      return;
    }

    this.lastServerStatus = status;
    this.serverStatusEmitter.emit('serverStatusUpdate', status);
  }

  @autobind
  public connect() {
    this.socket.onConnect(() => {
      this.sendServerStatusUpdate('on');
    });
    this.socket.onDisconnect(() => {
      this.sendServerStatusUpdate('off');
    });
    this.socket.onReconnect(() => {
      this.sendServerStatusUpdate('on');
    });
  }

  @autobind
  public disconnect() {
    this.socket.disconnect();
  }
}

export { Socket };
