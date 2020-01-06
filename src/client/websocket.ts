import { AnySocket } from './socket';
import { ReconnectableWebsocket } from './ReconnectableWebsocket';

class WebSocketInterface implements AnySocket<MessageEvent> {
  private websocket: ReconnectableWebsocket;

  constructor(private url: string) {
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

  public subscribe(handler: (message: MessageEvent) => void) {
    this.websocket.onMessage(handler);
  }

  public unsubscribe() {
    this.websocket.unsubscribeMessageHandler();
  }

  public disconnect() {
    this.websocket.disconnect();
  }
}

export { WebSocketInterface };
