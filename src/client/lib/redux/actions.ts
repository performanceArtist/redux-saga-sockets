export const serverOn = () => ({
  type: 'SOCKET:SERVER_ON'
} as const);

export const serverOff = () => ({
  type: 'SOCKET:SERVER_OFF'
} as const);

export const startChannel = () => ({ type: 'SOCKET:START_CHANNEL' } as const);
export const stopChannel = () => ({ type: 'SOCKET:STOP_CHANNEL' } as const);

type ActionCreators = { [key: string]: (...args: any) => object };
type ActionTypes<T extends ActionCreators> = ReturnType<T[keyof T]>;

export const actions = { serverOn, serverOff, startChannel, stopChannel };
export type Actions = ActionTypes<typeof actions>;
