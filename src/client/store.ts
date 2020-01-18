import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import { reducer as socketReducer, namespace as socketNamespace } from './lib/redux';
import { reducer as messageReducer, namespace as messageNamespace } from './MessagesFeature';
import { rootSaga as socketSaga } from './sockets/saga';
import { rootSaga as messageSaga } from './MessagesFeature/redux/saga';

function* rootSaga() {
  yield all([
    socketSaga(),
    messageSaga()
  ])
}

const reducer = combineReducers({
  socket: socketReducer,
  message: messageReducer
});

const sagaMiddleware = createSagaMiddleware();

const composeEnhancer =
  (process.env.NODE_ENV !== 'production' &&
    (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
  compose;

export type AppReduxState = {
  socket: socketNamespace.ReduxState,
  message: messageNamespace.ReduxState
}

export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
