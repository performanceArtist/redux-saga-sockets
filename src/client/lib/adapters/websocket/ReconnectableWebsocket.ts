import { EventEmitter } from 'events';

type ReconnectableWebsocketOptions = {
  url: string;
  reconnectTimeout?: number;
  pingTimeout?: number;
};

const PING_MESSAGE = 'PING';

class ReconnectableWebsocket {
  private websocket!: WebSocket;
  private reconnectInterval!: NodeJS.Timeout | null;
  private pingInterval!: NodeJS.Timeout | null;
  private onMessageCallback!: (event: MessageEvent) => void;
  private connected = false;
  private emitter = new EventEmitter();
  private options: Required<ReconnectableWebsocketOptions>;

  constructor(options: ReconnectableWebsocketOptions) {
    const { url, reconnectTimeout = 3000, pingTimeout = 3000 } = options;
    this.options = { url, reconnectTimeout, pingTimeout };
  }

  connect() {
    this.init(false);
  }

  disconnect() {
    this.clearReconnectInterval();
    this.clearPingInterval();
    this.websocket.close();
  }

  unsubscribeMessageHandler() {
    this.onMessageCallback &&
      this.emitter.off('message', this.onMessageCallback);
  }

  onConnect(callback: (event?: Event) => void) {
    this.emitter.on('connect', callback);
  }

  onMessage(callback: (event: MessageEvent) => void) {
    this.onMessageCallback = callback;
    this.emitter.on(
      'message',
      message => message !== PING_MESSAGE && callback(message),
    );
  }

  onDisconnect(callback: (event?: CloseEvent) => void) {
    this.emitter.on('disconnect', callback);
  }

  onReconnect(callback: () => void) {
    this.emitter.on('reconnect', callback);
  }

  private init(isReconnect = false) {
    this.websocket && this.websocket.close();
    this.websocket = new WebSocket(this.options.url);

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
      this.clearReconnectInterval();
      this.clearPingInterval();
      this.pingInterval = setInterval(
        () => this.emitter.emit('message', PING_MESSAGE),
        this.options.pingTimeout,
      );

      this.websocket.addEventListener('message', messageEvent => {
        this.emitter.emit('message', messageEvent);
      });
    });
  }

  private clearReconnectInterval() {
    this.reconnectInterval && clearInterval(this.reconnectInterval);
    this.reconnectInterval = null;
  }

  private clearPingInterval() {
    this.pingInterval && clearInterval(this.pingInterval);
    this.pingInterval = null;
  }

  private reconnect() {
    if (
      this.reconnectInterval ||
      this.websocket.readyState === WebSocket.OPEN
    ) {
      return;
    }

    const tryToReconnect = () => {
      this.init(true);
    };

    this.reconnectInterval = setInterval(
      tryToReconnect,
      this.options.reconnectTimeout,
    );
  }
}

export { ReconnectableWebsocket };
