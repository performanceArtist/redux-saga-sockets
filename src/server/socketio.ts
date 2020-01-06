import http from 'http';
import express from 'express';
import socketIO from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const MESSAGE_TIMEOUT = 5000;

io.on('connection', client => {
  console.log('New client');
  setInterval(() => {
    client.emit('message', { message: new Date().getTime() });
  }, MESSAGE_TIMEOUT);
});

app.get('/', (req, res) => {
  res.json({ test: 'test' });
});

server.listen(5001, () => {
  console.log('Listening on port 5001');
});
