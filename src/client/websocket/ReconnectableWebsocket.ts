import { EventEmitter } from 'events';

class ReconnectableWebsocket extends EventEmitter {
  private websocket!: WebSocket;
  private reconnectInterval!: NodeJS.Timeout | null;
  private onMessageCallback!: (event: MessageEvent) => void;
  private connected = false;

  constructor(private url: string, private reconnectTimeout = 3000) {
    super();
  }

  connect() {
    this.init(false);
  }

  disconnect() {
    this.websocket.close();
    this.clearInterval();
  }

  unsubscribeMessageHandler() {
    this.onMessageCallback && this.off('message', this.onMessageCallback);
  }

  onConnect(callback: (event?: Event) => void) {
    this.on('connect', callback);
  }

  onMessage(callback: (event?: MessageEvent) => void) {
    this.onMessageCallback = callback;
    this.on('message', callback);
  }

  onDisconnect(callback: (event?: CloseEvent) => void) {
    this.on('disconnect', callback);
  }

  onReconnect(callback: () => void) {
    this.on('reconnect', callback);
  }

  private init(isReconnect = false) {
    this.websocket && this.websocket.close();
    this.websocket = new WebSocket(this.url);

    this.websocket.addEventListener('error', event => {
      this.connected && this.emit('disconnect', event);
      this.connected = false;
      this.websocket.close();
      this.reconnect();
    });

    this.websocket.addEventListener('close', event => {
      if (event.code === 1000) {
        this.clearInterval();
        this.websocket.close();
      } else {
        this.reconnect();
      }
    });

    this.websocket.addEventListener('open', event => {
      isReconnect
        ? this.emit('reconnect')
        : this.emit('connect', event);

      this.connected = true;
      this.clearInterval();

      this.websocket.addEventListener('message', event => {
        this.emit('message', event);
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
