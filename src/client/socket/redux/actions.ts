export const channelOn = () => ({
  type: 'SOCKET:CHANNEL_ON'
} as const);

export const channelOff = () => ({
  type: 'SOCKET:CHANNEL_OFF'
} as const);

export const serverOn = () => ({
  type: 'SOCKET:SERVER_ON'
} as const);

export const serverOff = () => ({
  type: 'SOCKET:SERVER_OFF'
} as const);

export const startChannel = () => ({ type: 'SOCKET:START_CHANNEL' });
export const stopChannel = () => ({ type: 'SOCKET:STOP_CHANNEL' });

type ActionCreators = { [key: string]: (...args: any) => object };
type ActionTypes<T extends ActionCreators> = ReturnType<T[keyof T]>;

export const actions = { channelOn, channelOff, serverOn, serverOff, startChannel, stopChannel };
export type Actions = ActionTypes<typeof actions>;
export type PickByType<K extends Actions['type']> = Extract<Actions, { type: K }>;
