import { all } from 'redux-saga/effects';

import { socket } from './socket';
import { SocketSaga } from '../lib/redux';

const saga = new SocketSaga(socket);

function* rootSaga() {
  yield all([saga.listen()])
}

export { rootSaga };
