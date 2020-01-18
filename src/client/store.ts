import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { reducer as socketReducer, namespace as socketNamespace } from './lib/redux';
import { reducer as messageReducer, namespace as messageNamespace } from './features/Messages';
import { rootSaga } from './saga';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancer =
  (process.env.NODE_ENV !== 'production' &&
    (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
  compose;

const reducer = combineReducers({
  socket: socketReducer,
  message: messageReducer
});

export type AppReduxState = {
  socket: socketNamespace.ReduxState,
  message: messageNamespace.ReduxState
}

export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
