import { all } from 'redux-saga/effects';

import { Socket } from './socket';

const socket = new Socket();

function* rootSaga() {
  yield all([socket.listen()])
}

export { rootSaga, socket };
