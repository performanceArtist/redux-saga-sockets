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

class Socket<T, C = never> extends EventEmitter {
  private socket!: AnySocket<T, C>;
  public onMessage?: AnySocket<T, C>['onMessage'];
  public offMessage?: AnySocket<T, C>['offMessage'];

  constructor() {
    super();
  }

  public init(socket: AnySocket<T, C>) {
    this.socket && this.socket.disconnect();
    this.socket = socket;
    this.onMessage = socket.onMessage;
    this.offMessage = socket.offMessage;
  }

  public subscribe(makeAction: ToAction<T>): void
  public subscribe(channel: C, makeAction: ToAction<T>): void
  subscribe(a: ToAction<T> | C, b?: ToAction<T>) {
    if (typeof a === 'string' && b) {
      this.socket.subscribe(b, a);
    } else {
      this.socket.subscribe(a as ToAction<T>);
    }
  }

  public unsubscribe(makeAction: ToAction<T>): void
  public unsubscribe(channel: C, makeAction: ToAction<T>): void
  unsubscribe(a: ToAction<T> | C, b?: ToAction<T>) {
    if (typeof a === 'string' && b) {
      this.socket.unsubscribe(b, a);
    } else {
      this.socket.unsubscribe(a as ToAction<T>);
    }
  }

  @autobind
  public connect() {
    this.socket.onConnect(() => {
      this.emit('serverStatusUpdate', 'on');
    });
    this.socket.onDisconnect(() => {
      this.emit('serverStatusUpdate', 'off');
    });
    this.socket.onReconnect(() => {
      this.emit('serverStatusUpdate', 'on');
    });
  }

  @autobind
  public disconnect() {
    this.socket.disconnect();
  }
}

export { Socket };
