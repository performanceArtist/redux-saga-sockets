import { Socket } from '../lib/core';
import { SocketMessage, SocketChannel } from './types';

export const socket = new Socket<SocketMessage, SocketChannel>();
