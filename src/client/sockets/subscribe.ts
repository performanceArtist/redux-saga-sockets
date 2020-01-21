import { ToAction } from '../lib/core';

import { socket } from './socket';
import { SocketChannel, ByChannel } from './types';

export function subscribe<K extends SocketChannel>(channel: K, toAction: ToAction<ByChannel<K>>) {
  socket.subscribe(
    channel,
    toAction,
  );

  return () => unsubscribe(channel, toAction);
}

export function unsubscribe<K extends SocketChannel>(channel: K, toAction: ToAction<ByChannel<K>>) {
  socket.unsubscribe(
    channel,
    toAction,
  );
}
