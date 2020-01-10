import { actions } from '../features/Messages/redux';

const { websocketMessage } = actions;

export const websocketMessageToAction = (event: MessageEvent) => {
  const data = JSON.parse(event.data);

  return websocketMessage(data.message);
};
