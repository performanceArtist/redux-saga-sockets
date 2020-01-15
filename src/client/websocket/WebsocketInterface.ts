import { AnySocket } from '../socket';
import { ReconnectableWebsocket } from './ReconnectableWebsocket';

class WebSocketInterface<T> implements AnySocket<T> {
  private websocket: ReconnectableWebsocket;

  constructor(private url: string, private converter?: (data: any) => T) {
    this.websocket = new ReconnectableWebsocket(this.url);
  }

  public onConnect(resolve: () => void) {
    this.websocket.onConnect(resolve);
    this.websocket.connect();
  }

  public onDisconnect(resolve: () => void) {
    this.websocket.onDisconnect(resolve);
  }

  public onReconnect(resolve: () => void) {
    this.websocket.onReconnect(resolve);
  }

  public subscribe(handler: (data: T) => void) {
    this.websocket.onMessage(
      event => {
        const data = JSON.parse(event.data);
        this.converter
          ? handler(this.converter(data))
          : handler(data);
      }
    );
  }

  public unsubscribe() {
    this.websocket.unsubscribeMessageHandler();
  }

  public disconnect() {
    this.websocket.disconnect();
  }
}

export { WebSocketInterface };
