import React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { actions } from '../../redux';
import { actions as socketActions } from '../../../lib/redux';
import { startIO, startWebsocket } from '../../../sockets';
import { AppReduxState } from 'client/store';
import './TestPanel.scss';

type Props = typeof mapDispatch & ReturnType<typeof mapState>;
type State = {
  mode: 'io' | 'websocket'
}

const mapState = (state: AppReduxState) => ({
  ...state.socket
});

const { startListen, stopListen } = socketActions;
const mapDispatch = { startListen, stopListen, ...actions };

class TestPanel extends React.Component<Props, State> {
  public state: State = {
    mode: 'websocket'
  }

  render() {
    const { channelStatus, serverStatus } = this.props;

    return (
      <div className="test-panel">
        <div className="test-panel__checkboxes">
          <label className="test-panel__checkbox">
            IO
            <input
              type="radio"
              name="mode"
              value="io"
              checked={this.state.mode === 'io'}
              onChange={this.handleModeSwitch}
            />
          </label>
          <label className="test-panel__checkbox">
            Websocket
            <input
              type="radio"
              name="mode"
              value="websocket"
              checked={this.state.mode === 'websocket'}
              onChange={this.handleModeSwitch}
            />
          </label>
        </div>
        <button
          type="button"
          className="test-panel__button"
          onClick={this.startListen}
        >
          Start channel
        </button>
        <button
          className="test-panel__button"
          type="button" onClick={this.stopListen}
        >
          Stop channel
        </button>
        <div>
          <h3>
            Channel status: {channelStatus}
          </h3>
          <h3>
            Server status: {serverStatus}
          </h3>
        </div>
      </div>
    );
  }

  @autobind
  private handleModeSwitch(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const mode = target.value as 'io' | 'websocket';

    this.setState({ mode }, this.startListen);
  }

  @autobind
  private startListen() {
    const {
      stopListen,
      startListen,
      channelStatus,
      subsribeToIO,
      unsubsribeFromIO,
      subsribeToWebsocket,
      unsubsribeFromWebsocket
     } = this.props;
    const { mode } = this.state;

    channelStatus === 'on' && stopListen();

    if (mode === 'io') {
      startIO();
      channelStatus === 'on' && unsubsribeFromWebsocket();
      subsribeToIO();
    } else {
      startWebsocket();
      channelStatus === 'on' && unsubsribeFromIO();
      subsribeToWebsocket();
    }

    startListen();
  }

  @autobind
  private stopListen() {
    const { stopListen, channelStatus, unsubsribeFromIO, unsubsribeFromWebsocket } = this.props;
    const { mode } = this.state;

    if (channelStatus !== 'on') {
      return;
    }

    if (mode === 'io') {
      unsubsribeFromIO();
    } else {
      unsubsribeFromWebsocket();
    }

    stopListen();
  }
}

const connectedComponent = connect(mapState, mapDispatch)(TestPanel);
export { connectedComponent as TestPanel };