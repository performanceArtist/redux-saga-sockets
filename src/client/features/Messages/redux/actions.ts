export const ioMessage = (message: string) => ({
  type: 'IO:MESSAGE',
  payload: message
} as const);

export const websocketMessage = (message: string) => ({
  type: 'WEBSOCKET:MESSAGE',
  payload: message
} as const);

type GetActionTypes<T extends Record<string, (...args: any) => any>> = ReturnType<T[keyof T]>;

export const actions = { ioMessage, websocketMessage };
export type Actions = GetActionTypes<typeof actions>;
