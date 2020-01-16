import { all } from 'redux-saga/effects';

import { Socket } from './socket';
import { SocketSaga } from './reduxSocket';
import { SocketData, SocketChannel } from './socketTypes';

export const socket = new Socket<SocketData, SocketChannel>();

const saga = new SocketSaga(socket);

function* rootSaga() {
  yield all([saga.listen()])
}

export { rootSaga };
