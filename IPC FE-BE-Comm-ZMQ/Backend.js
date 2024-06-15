'use strict';

const zmq = require('zeromq');
const fs = require('fs');
const socketPath = 'ipc:///tmp/game_backend_socket';

const responder = zmq.socket('rep');

responder.bind(socketPath, (err) => {
  if (err) throw err;
  console.log(`Game backend listening on ${socketPath}`);
});

responder.on('message', (data) => {
  console.log(`Backend received: ${data}`);
  const response = processGameLogic(data.toString());
  responder.send(response);
});

function processGameLogic(data) {
  // Placeholder for logic processing
  return `Processed: ${data}`;
}
