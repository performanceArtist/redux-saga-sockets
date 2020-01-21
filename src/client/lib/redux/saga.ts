import { autobind } from 'core-decorators';
import { eventChannel } from 'redux-saga';
import {
  take,
  call,
  fork,
  put,
  race
} from 'redux-saga/effects';

import { Socket } from '../core';
import { actions } from './actions';

const { serverOn, serverOff } = actions;

class SocketSaga {
  constructor(private socket: Socket<any, any>) {}

  @autobind
  private createMessageChannel() {
    return eventChannel(emit => {
      this.socket.onMessage && this.socket.onMessage(emit);
      return () => {
        this.socket.offMessage && this.socket.offMessage(emit);
      };
    });
  }

  @autobind
  private createServerChannel() {
    return eventChannel(emit => {
      const handler = (status: 'on' | 'off') => {
        const action = status === 'on'
          ? serverOn()
          : serverOff();

        emit(action);
      };

      this.socket.onServerStatusChange(handler);

      return () => {
        this.socket.offServerStatusChange(handler);
      }
    });
  }

  @autobind
  private* channelListen(channel: any) {
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  }

  @autobind
  private* listenServerSaga() {
    try {
      const serverChannel = yield call(this.createServerChannel);
      const messageChannel = yield call(this.createMessageChannel);

      yield fork(this.channelListen, serverChannel);
      yield fork(this.channelListen, messageChannel);
    } catch (error) {
      this.socket.disconnect();
      console.log(error); // eslint-disable-line
    }
  }

  @autobind
  public* listen() {
    while (true) {
      yield take('SOCKET:START_LISTEN');
      yield race({
        task: call(this.listenServerSaga),
        cancel: take('SOCKET:STOP_LISTEN'),
      });
    }
  }
}

export { SocketSaga };
