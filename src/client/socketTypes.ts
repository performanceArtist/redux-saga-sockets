export type SocketData = { type: 'one', message: string } | { type: 'two', message: string };
export type SocketChannel = SocketData['type'];
