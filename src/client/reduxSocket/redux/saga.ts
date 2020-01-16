import { autobind } from 'core-decorators';
import { eventChannel } from 'redux-saga';
import {
  take,
  call,
  fork,
  put,
  race,
  cancelled,
} from 'redux-saga/effects';

import { Socket } from '../../socket';
import { actions } from './actions';

const { serverOn, serverOff, channelOn, channelOff } = actions;

class SocketSaga {
  constructor(private socket: Socket<any, any>) {}

  @autobind
  private createMessageChannel() {
    return eventChannel(emit => {
      this.socket.onMessage && this.socket.onMessage(emit);
      return () => {
        //this.socket.unsubscribe();
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

      this.socket.on('serverStatusUpdate', handler);

      return () => {
        this.socket.off('serverStatusUpdate', handler)
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
      yield put(channelOn());
      const serverChannel = yield call(this.createServerChannel);
      const messageChannel = yield call(this.createMessageChannel);

      yield fork(this.channelListen, serverChannel);
      yield fork(this.channelListen, messageChannel);
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

export { SocketSaga };
