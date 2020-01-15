import { Socket, Action } from './socket';

type Messages = { type: 'one' } | { type: 'two' };
type Channels = Messages['type'];
type PickMesssage<T> = Extract<Messages, { type: T }>;
const csocket = new Socket<Messages, Channels>(
  (data: Messages, channel: Channels) => data.type === channel
);

csocket.subscribe('one', (data: PickMesssage<'one'>) => {

});

function csub<T extends Channels>(channel: T, callback: Action<PickMesssage<T>>) {
  csocket.subscribe(channel, callback);
}

csub('one', data => {

});
