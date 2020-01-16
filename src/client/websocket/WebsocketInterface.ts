import EventEmitter from 'events';
import { autobind } from 'core-decorators';

import { AnySocket } from '../socket';
import { ReconnectableWebsocket } from './ReconnectableWebsocket';

type PickChannel<T, C> = C extends never
  ? never
  : (data: T, channel: C) => boolean;

type Subscriber<T, C> = {
  action: (data: T) => any;
  channel?: C;
};

type Options<T, C> = {
  url: string;
  converter?: (data: any) => T;
  pickChannel?: PickChannel<T, C>
}

class WebSocketInterface<T, C = never> implements AnySocket<T, C> {
  private websocket: ReconnectableWebsocket;
  private subscribers: Subscriber<T, C>[] = [];
  private messageEmitter = new EventEmitter();

  constructor(private options: Options<T, C>) {
    const { url } = this.options;

    this.websocket = new ReconnectableWebsocket(url);
  }

  @autobind
  public onMessage(handler: (data: T) => void) {
    this.messageEmitter.on('message', handler);
  }

  @autobind
  public offMessage(handler: (data: T) => void) {
    this.messageEmitter.off('message', handler);
  }

  public onConnect(resolve: () => void) {
    const { converter, pickChannel } = this.options;

    this.websocket.onConnect(resolve);
    this.websocket.connect();
    this.websocket.onMessage(
      event => {
        const data = JSON.parse(event.data);
        const converted = converter ? converter(data) : data;

        this.subscribers.forEach(({ action, channel }) => {
          const shouldEmit = pickChannel
            ? channel && pickChannel(converted, channel)
            : true;

          if (shouldEmit) {
            const message = action(converted);
            this.messageEmitter.emit('message', message);
          }
        });
      }
    );
  }

  public onDisconnect(resolve: () => void) {
    this.websocket.onDisconnect(resolve);
  }

  public onReconnect(resolve: () => void) {
    this.websocket.onReconnect(resolve);
  }

  public subscribe(handler: (data: T) => void, channel?: C) {
    this.subscribers.push({ action: handler, channel });
  }

  public unsubscribe(handler: (data: T) => void, channel?: C) {
    this.subscribers = this.subscribers.filter(subscriber =>
      channel !== subscriber.channel && subscriber.action !== handler
    );
  }

  public disconnect() {
    this.websocket.disconnect();
  }
}

export { WebSocketInterface };
