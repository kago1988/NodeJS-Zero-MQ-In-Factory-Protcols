'use strict';

const zmq = require('zeromq');
const socketPath = 'ipc:///tmp/game_backend_socket';

const requester = zmq.socket('req');

requester.connect(socketPath);
console.log('Connected to backend');

const message = 'Player action data';
requester.send(message);
console.log(`Sent: ${message}`);

requester.on('message', (data) => {
  console.log(`Frontend received: ${data}`);
  // Update logic state or UI based on backend response
});
