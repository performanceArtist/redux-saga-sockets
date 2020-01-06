import http from 'http';
import express from 'express';
import { Server } from 'ws';

const app = express();
const server = http.createServer(app);
const websocketServer = new Server({ server });
const MESSAGE_TIMEOUT = 5000;

app.get('/', (req, res) => {
  res.json({ test: 'test' });
});

websocketServer.on('connection', (socket: WebSocket) => {
  socket.addEventListener('message', (event) => {
    socket.send(event.data);
  });

  setInterval(() => {
    socket.send(JSON.stringify({ message: new Date().getTime() }));
  }, MESSAGE_TIMEOUT);

});

server.listen(5000, () => {
  console.log('Listening on port 5000');
});
