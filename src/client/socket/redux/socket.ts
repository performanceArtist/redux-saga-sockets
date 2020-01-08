import { autobind } from 'core-decorators';
import { eventChannel } from 'redux-saga';
import {
  take,
  call,
  put,
  fork,
  race,
  cancelled,
  delay,
} from 'redux-saga/effects';

import { actions } from './actions';

const { serverOn, serverOff, channelOn, channelOff } = actions;

type EventHandler = (callback: () => void) => void;
export type AnySocket<T> = {
  onConnect: EventHandler;
  onDisconnect: EventHandler;
  onReconnect: EventHandler;
  disconnect: () => void;
  subscribe: (handler: (message: T) => void) => void;
  unsubscribe: (handler?: (message: T) => void) => void;
};
type Converter<T> = (message: T) => { type: string, payload?: any };

class Socket<T> {
  private socket!: AnySocket<T>;
  private converter!: Converter<T>;

  constructor(private connectionTimeout = 3000) {}

  public init(socket: AnySocket<T>, converter: Converter<T>) {
    this.socket && this.socket.disconnect();
    this.socket = socket;
    this.converter = converter;
  }

  public addSocketInterface(socket: AnySocket<T>) {
    this.socket = socket;
  }

  @autobind
  private connect() {
    return new Promise(resolve => {
      this.socket.onConnect(resolve);
    });
  }

  @autobind
  private disconnect() {
    return new Promise(resolve => {
      this.socket.onDisconnect(resolve);
    });
  }

  @autobind
  private reconnect() {
    return new Promise(resolve => {
      this.socket.onReconnect(resolve);
    });
  }

  @autobind
  private createChannel() {
    return eventChannel(emit => {
      const handler = (data: any) => emit(this.converter!(data));

      this.socket.subscribe(handler);

      return () => {
        this.socket.unsubscribe(handler);
      };
    });
  }

  @autobind
  private* listenDisconnectSaga() {
    while (true) {
      yield call(this.disconnect);
      yield put(serverOff());
    }
  }

  @autobind
  private* listenReconnectSaga() {
    while (true) {
      yield call(this.reconnect);
      yield put(serverOn());
    }
  }

  @autobind
  private* listenServerSaga() {
    try {
      yield put(channelOn());
      const { timeout } = yield race({
        connected: call(this.connect),
        timeout: delay(this.connectionTimeout),
      });

      if (timeout) {
        yield put(serverOff());
      } else {
        yield put(serverOn());
      }

      yield fork(this.listenDisconnectSaga);
      yield fork(this.listenReconnectSaga);

      const socketChannel = yield call(this.createChannel);

      while (true) {
        const action = yield take(socketChannel);
        yield put(action);
      }
    } catch (error) {
      console.log(error); // eslint-disable-line
    } finally {
      if (yield cancelled()) {
        this.socket.disconnect();
        yield put(channelOff());
      }
    }
  }

  @autobind
  public* listen() {
    while (true) {
      yield take('SOCKET:START_CHANNEL');
      yield race({
        task: call(this.listenServerSaga),
        cancel: take('SOCKET:STOP_CHANNEL'),
      });
    }
  }
}

export { Socket };
