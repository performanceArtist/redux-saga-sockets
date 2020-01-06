import React from 'react';
import { Provider } from 'react-redux';

import { TestPanel } from './components/TestPanel/TestPanel';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <h2>Test</h2>
      <TestPanel />
    </Provider>
  );
}

export { App };
