import { EventEmitter } from 'events';
import { autobind } from 'core-decorators';

type EventHandler = (callback: () => void) => void;
export type AnySocket<T> = {
  onConnect: EventHandler;
  onDisconnect: EventHandler;
  onReconnect: EventHandler;
  disconnect: () => void;
  subscribe: (handler: (message: T) => void) => void;
  unsubscribe: (handler?: (message: T) => void) => void;
}

export type Action<T> = (data: T) => any;
type Subscriber<T, C> = {
  action: Action<T>;
  channel?: C;
};

type PickChannel<T, C> = C extends never
  ? never
  : (data: T, channel: C) => boolean;

class Socket<T, C = never> extends EventEmitter {
  private socket!: AnySocket<T>;
  public subscribers: Subscriber<T, C>[] = [];

  constructor(public pickChannel?: PickChannel<T, C>) {
    super();
  }

  public init(socket: AnySocket<T>) {
    this.socket && this.socket.disconnect();
    this.socket = socket;
  }

  public initHandler(handler: any) {
    this.socket.subscribe(handler);
  }

  public subscribe(makeAction: Action<T>): void
  public subscribe(channel: C, makeAction: Action<T>): void
  subscribe(a: Action<T> | C, b?: Action<T>) {
    if (typeof a === 'string' && b) {
      this.subscribers.push({ action: b, channel: a });
    } else {
      this.subscribers.push({ action: a as Action<T> });
    }
  }

  public unsubscribe(makeAction: Action<T>): void
  public unsubscribe(channel: C, makeAction: Action<T>): void
  unsubscribe(a: Action<T> | C, b?: Action<T>) {
    if (typeof a === 'string' && b) {
      this.subscribers = this.subscribers.filter(({ action, channel }) =>
        channel !== a && action !== b
      );
    } else {
      this.subscribers = this.subscribers.filter(({ action }) => action !== a);
    }
  }

  @autobind
  private onConnect() {
    this.emit('serverStatusUpdate', 'on');
  }

  @autobind
  private onDisconnect() {
    this.emit('serverStatusUpdate', 'off');
  }

  @autobind
  private onReconnect() {
    this.emit('serverStatusUpdate', 'on');
  }

  @autobind
  public connect() {
    this.socket.onConnect(this.onConnect);
    this.socket.onDisconnect(this.onDisconnect);
    this.socket.onReconnect(this.onReconnect);
  }

  @autobind
  public disconnect() {
    this.socket.disconnect();
  }
}

export { Socket };
