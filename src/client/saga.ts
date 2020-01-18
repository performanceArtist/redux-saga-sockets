import { all } from 'redux-saga/effects';

import { Socket } from './lib/core';
import { SocketSaga } from './lib/redux';
import { SocketData, SocketChannel } from './socketTypes';

export const socket = new Socket<SocketData, SocketChannel>();

const saga = new SocketSaga(socket);

function* rootSaga() {
  yield all([saga.listen()])
}

export { rootSaga };
