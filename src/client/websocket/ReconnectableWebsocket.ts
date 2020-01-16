import { EventEmitter } from 'events';

class ReconnectableWebsocket {
  private websocket!: WebSocket;
  private reconnectInterval!: NodeJS.Timeout | null;
  private onMessageCallback!: (event: MessageEvent) => void;
  private connected = false;
  private emitter = new EventEmitter();

  constructor(private url: string, private reconnectTimeout = 3000) {}

  connect() {
    this.init(false);
  }

  disconnect() {
    this.clearInterval();
    this.websocket.close();
  }

  unsubscribeMessageHandler() {
    this.onMessageCallback && this.emitter.off('message', this.onMessageCallback);
  }

  onConnect(callback: (event?: Event) => void) {
    this.emitter.on('connect', callback);
  }

  onMessage(callback: (event: MessageEvent) => void) {
    this.onMessageCallback = callback;
    this.emitter.on('message', callback);
  }

  onDisconnect(callback: (event?: CloseEvent) => void) {
    this.emitter.on('disconnect', callback);
  }

  onReconnect(callback: () => void) {
    this.emitter.on('reconnect', callback);
  }

  private init(isReconnect = false) {
    this.websocket && this.websocket.close();
    this.websocket = new WebSocket(this.url);

    this.websocket.addEventListener('error', event => {
      this.connected && this.emitter.emit('disconnect', event);
      this.connected = false;
      this.websocket.close();
      this.reconnect();
    });

    this.websocket.addEventListener('close', event => {
      if (event.code === 1000) {
        this.disconnect();
      } else {
        this.reconnect();
      }
    });

    this.websocket.addEventListener('open', event => {
      isReconnect
        ? this.emitter.emit('reconnect')
        : this.emitter.emit('connect', event);

      this.connected = true;
      this.reconnectInterval && clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;

      this.websocket.addEventListener('message', messageEvent => {
        this.emitter.emit('message', messageEvent);
      });
    });
  }

  private clearInterval() {
    this.reconnectInterval && clearInterval(this.reconnectInterval);
    this.reconnectInterval = null;
  }

  private reconnect() {
    if (this.reconnectInterval || this.websocket.readyState === WebSocket.OPEN) {
      return;
    }

    const tryToReconnect = () => {
      this.init(true);
    };

    this.reconnectInterval = setInterval(tryToReconnect, this.reconnectTimeout);
  }
}

export { ReconnectableWebsocket };
