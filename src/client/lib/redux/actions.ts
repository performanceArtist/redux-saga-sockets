export const serverOn = () => ({
  type: 'SOCKET:SERVER_ON'
} as const);

export const serverOff = () => ({
  type: 'SOCKET:SERVER_OFF'
} as const);

export const startListen = () => ({ type: 'SOCKET:START_LISTEN' } as const);
export const stopListen = () => ({ type: 'SOCKET:STOP_LISTEN' } as const);

type ActionCreators = { [key: string]: (...args: any) => object };
type ActionTypes<T extends ActionCreators> = ReturnType<T[keyof T]>;

export const actions = { serverOn, serverOff, startListen, stopListen };
export type Actions = ActionTypes<typeof actions>;
