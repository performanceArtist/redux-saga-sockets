import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '../../../../store';

import './Messages.scss';

const mapState = (state: AppReduxState) => ({
  ...state.message
});

type Props = ReturnType<typeof mapState>;

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

const connectedComponent = connect(mapState)(Messages);
export { connectedComponent as Messages };
