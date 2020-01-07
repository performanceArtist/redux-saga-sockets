import { Actions } from './actions';
import { initial } from './initial';
import { ReduxState } from '../namespace';

function reducer(state = initial, action: Actions): ReduxState {
  switch(action.type) {
    case 'IO:MESSAGE':
      return {
        ...state,
        messages: state.messages.concat(`Socket.io: ${action.payload}`)
      }
    case 'WEBSOCKET:MESSAGE':
      return {
        ...state,
        messages: state.messages.concat(`Websocket: ${action.payload}`)
      }
    default:
      return state;
  }
}

export { reducer };
