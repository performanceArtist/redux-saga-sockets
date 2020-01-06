import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { reducer } from './socket';
import { rootSaga } from './saga';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancer =
  (process.env.NODE_ENV !== 'production' &&
    (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
  compose;

export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
