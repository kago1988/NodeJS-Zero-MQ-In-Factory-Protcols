'use strict';

const net = require('net');
const socketPath = '/tmp/game_backend_socket';

const client = net.createConnection(socketPath);

client.on('connect', () => {
  console.log('Connected to backend');
  client.write('Player action data');
});

client.on('data', (data) => {
  console.log(`Frontend received: ${data}`);
  // Update logic state or UI based on backend response
});

client.on('error', (err) => {
  console.error(`Client error: ${err}`);
});
