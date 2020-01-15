import { ReduxState } from '../namespace';

import { initial } from './initial';
import { Actions } from './actions';

function reducer(state = initial, action: Actions): ReduxState {
  switch(action.type) {
    case 'SOCKET:CHANNEL_ON':
      return { ...state, channelStatus: 'on' };
    case 'SOCKET:CHANNEL_OFF':
      return { ...state, channelStatus: 'off' };
    case 'SOCKET:SERVER_ON':
      return { ...state, serverStatus: 'on' };
    case 'SOCKET:SERVER_OFF':
      return { ...state, serverStatus: 'off' };
    default:
      return state;
  }
}

export { reducer };
