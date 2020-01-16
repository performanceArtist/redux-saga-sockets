import { all } from 'redux-saga/effects';

import { Socket } from './socket';
import { SocketSaga } from './reduxSocket';

export const socket = new Socket<{ message: string }, 'one' | 'two'>();

const saga = new SocketSaga(socket);

function* rootSaga() {
  yield all([saga.listen()])
}

export { rootSaga };
