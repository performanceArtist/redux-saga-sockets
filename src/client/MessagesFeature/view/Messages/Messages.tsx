import React from 'react';
import { connect } from 'react-redux';

import { actions } from '../../redux';
import { AppReduxState } from '../../../store';

import './Messages.scss';

const mapState = (state: AppReduxState) => ({
  ...state.message
});

const {
  subsribeToWebsocket,
  unsubsribeFromWebsocket,
  subsribeToIO,
  unsubsribeFromIO
} = actions;

const mapDispatch = {
  subsribeToWebsocket,
  unsubsribeFromWebsocket,
  subsribeToIO,
  unsubsribeFromIO
}

type Props = ReturnType<typeof mapState> & typeof mapDispatch;

class Messages extends React.Component<Props> {
  render() {
    const { messages } = this.props;

    return (
      <div className="messages">
        {messages.map(message => <div key={message}>{message}</div>)}
      </div>
    );
  }
}

const connectedComponent = connect(mapState, mapDispatch)(Messages);
export { connectedComponent as Messages };
