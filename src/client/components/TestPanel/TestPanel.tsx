import React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { actions, namespace } from '../../socket';
import { startIO, startWebsocket } from '../../startSocket';

type Props = typeof mapDispatch & ReturnType<typeof mapState>;
type State = {
  mode: 'io' | 'websocket'
}

const mapState = (state: namespace.ReduxState) => ({
  ...state
});

const { startChannel, stopChannel } = actions;
const mapDispatch = { startChannel, stopChannel };

class TestPanel extends React.Component<Props, State> {
  public state: State = {
    mode: 'websocket'
  }

  @autobind
  private handleModeSwitch(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    this.setState({ mode: target.value as any });
    target.value === 'websocket' ? startWebsocket() : startIO();
  }

  render() {
    const { startChannel, stopChannel, channelStatus, serverStatus } = this.props;

    return (
      <div>
        <div>
          IO
          <input
            type="radio"
            name="mode"
            value="io"
            checked={this.state.mode === 'io'}
            onChange={this.handleModeSwitch}
          />
          Websocket
          <input
            type="radio"
            name="mode"
            value="websocket"
            checked={this.state.mode === 'websocket'}
            onChange={this.handleModeSwitch}
          />
        </div>
        <button type="button" onClick={() => {
          this.state.mode === 'websocket' ? startWebsocket() : startIO();
          startChannel();
        }}>Start channel</button>
        <button type="button" onClick={() => stopChannel()}>Stop channel</button>
        <div>
          <h3>
            Channel: {channelStatus}
          </h3>
          <h3>
            Server: {serverStatus}
          </h3>
        </div>
      </div>
    );
  }
}

const connectedComponent = connect(mapState, mapDispatch)(TestPanel);
export { connectedComponent as TestPanel };