'use strict';

const net = require('net');
const fs = require('fs');
const socketPath = '/tmp/game_backend_socket';

if (fs.existsSync(socketPath)) {
  fs.unlinkSync(socketPath);
}

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(`Backend received: ${data}`);
    const response = processGameLogic(data);
    socket.write(response);
  });

  socket.on('error', (err) => {
    console.error(`Socket error: ${err}`);
  });
});

function processGameLogic(data) {
  // Placeholder for game logic processing
  return `Processed: ${data}`;
}

server.listen(socketPath, () => {
  console.log(`Game backend listening on ${socketPath}`);
});
