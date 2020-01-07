export const ioMessage = (data: any) => ({
  type: 'IO:MESSAGE',
  payload: data
} as const);

export const websocketMessage = (data: any) => ({
  type: 'WEBSOCKET:MESSAGE',
  payload: data
} as const);

type GetActionTypes<T extends Record<string, (...args: any) => any>> = ReturnType<T[keyof T]>;

export const actions = { ioMessage, websocketMessage };
export type Actions = GetActionTypes<typeof actions>;
