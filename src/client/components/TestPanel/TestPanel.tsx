import React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { actions } from '../../socket';
import { startIO, startWebsocket } from '../../startSocket';
import { AppReduxState } from 'client/store';
import './TestPanel.scss';

type Props = typeof mapDispatch & ReturnType<typeof mapState>;
type State = {
  mode: 'io' | 'websocket'
}

const mapState = (state: AppReduxState) => ({
  ...state.socket
});

const { startChannel, stopChannel } = actions;
const mapDispatch = { startChannel, stopChannel };

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
          onClick={this.startChannel}
        >
          Start channel
        </button>
        <button
          className="test-panel__button"
          type="button" onClick={this.stopChannel}
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

    this.setState({ mode }, this.startChannel);
  }

  @autobind
  private startChannel() {
    const { stopChannel, startChannel, channelStatus } = this.props;
    const { mode } = this.state;

    channelStatus === 'on' && stopChannel();
    mode === 'websocket' ? startWebsocket() : startIO();
    startChannel();
  }

  @autobind
  private stopChannel() {
    const { stopChannel } = this.props;
    stopChannel();
  }
}

const connectedComponent = connect(mapState, mapDispatch)(TestPanel);
export { connectedComponent as TestPanel };