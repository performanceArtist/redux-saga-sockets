export const ioMessage = (message: string) => ({
  type: 'IO:MESSAGE' as const,
  payload: message
});

export const websocketMessage = (message: string) => ({
  type: 'WEBSOCKET:MESSAGE' as const,
  payload: message
});

export const subsribeToWebsocket = () => ({
  type: 'WEBSOCKET:SUBSCRIBE' as const
});

export const unsubsribeFromWebsocket = () => ({
  type: 'WEBSOCKET:UNSUBSCRIBE' as const
});

export const subsribeToIO = () => ({
  type: 'IO:SUBSCRIBE' as const
});

export const unsubsribeFromIO = () => ({
  type: 'IO:UNSUBSCRIBE' as const
});

type GetActionTypes<T extends Record<string, (...args: any) => any>> = ReturnType<T[keyof T]>;

export const actions = {
  ioMessage,
  websocketMessage,
  subsribeToWebsocket,
  unsubsribeFromWebsocket,
  subsribeToIO,
  unsubsribeFromIO
};
export type Actions = GetActionTypes<typeof actions>;
