var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')({
      "transports": ["xhr-polling"],
      "polling duration":10
    }).listen(server);

let scoreResults=[];



io.on('connection', (client) => {
  client.on('subscribeToResults', (interval) => {
    console.log('client is subscribing to results with interval ', interval);
    setInterval(() => {
      client.emit('results',scoreResults );
    }, interval);
  });

  client.on('chat message', (msg)=>{
    console.log(msg);
    scoreResults.push(msg);
  });
  client.on('error',function () {
  
  });
});

server.listen(process.env.PORT || 8021);