import { all, takeLatest } from 'redux-saga/effects';

import { subscribe, unsubscribe, ByChannel } from '../../sockets';

import { actions } from './actions';

const {
  websocketMessage,
  ioMessage,
} = actions;

const onWebsocketOne = (data: ByChannel<'one'>) => websocketMessage(`Type one: ${data.message}`);
const onWebsocketTwo = (data: ByChannel<'two'>) => websocketMessage(`Type two: ${data.message}`);

function subscribeToWebsocket() {
  subscribe('one', onWebsocketOne);
  subscribe('two', onWebsocketTwo);
}

function unsubscribeFromWebsocket() {
  unsubscribe('one', onWebsocketOne);
  unsubscribe('two', onWebsocketTwo);
}

const onIOOne = (data: ByChannel<'one'>) => ioMessage(`Type one: ${data.message}`);
const onIOTwo = (data: ByChannel<'two'>) => ioMessage(`Type two: ${data.message}`);

function subscribeToIO() {
  subscribe('one', onIOOne);
  subscribe('two', onIOTwo);
}

function unsubscribeFromIO() {
  unsubscribe('one', onIOOne);
  unsubscribe('two', onIOTwo);
}

function* rootSaga() {
  yield all([
    takeLatest(actions.subsribeToWebsocket().type, subscribeToWebsocket),
    takeLatest(actions.unsubsribeFromWebsocket().type, unsubscribeFromWebsocket),
    takeLatest(actions.subsribeToIO().type, subscribeToIO),
    takeLatest(actions.unsubsribeFromIO().type, unsubscribeFromIO)
  ])
}

export { rootSaga };
