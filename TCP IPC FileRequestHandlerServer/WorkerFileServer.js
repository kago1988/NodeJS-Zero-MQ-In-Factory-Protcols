'use strict';

const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');
const numWorkers = require('os').cpus().length;

if (cluster.isMaster) {
  const router = zmq.socket('router').bind('tcp://127.0.0.1:60401');
  const dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

  router.on('message', (...frames) => dealer.send(frames));
  dealer.on('message', (...frames) => router.send(frames));

  // Listen for workers to come online.
  cluster.on('online', worker => console.log(`Worker ${worker.process.pid} is online.`));

  // Fork a worker process for each CPU.
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

} else {
  const responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');

  responder.on('message', data => {
    const request = JSON.parse(data);
    console.log(`${process.pid} received request for: ${request.path}`);

    fs.readFile(request.path, (err, content) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        responder.send(JSON.stringify({
          error: 'File read error',
          timestamp: Date.now(),
          pid: process.pid
        }));
        return;
      }
      console.log(`${process.pid} sending response`);
      responder.send(JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid
      }));
    });
  });
}
