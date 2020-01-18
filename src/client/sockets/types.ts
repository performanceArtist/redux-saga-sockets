export type SocketMessage = { type: 'one', message: string } | { type: 'two', message: string };
export type SocketChannel = SocketMessage['type'];
export type ByChannel<C extends SocketChannel> = Extract<SocketMessage, { type: C }>;
