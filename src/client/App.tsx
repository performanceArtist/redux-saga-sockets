import React from 'react';
import { Provider } from 'react-redux';

import { Messages, TestPanel } from './MessagesFeature';
import { store } from './store';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <div className="app__content">
          <div className="app__controls">
            <h2 className="app__title">Controls/Status</h2>
            <div className="app__test-panel">
              <TestPanel />
            </div>
          </div>
          <div className="app__messages">
            <h2>Messages</h2>
            <Messages />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export { App };
