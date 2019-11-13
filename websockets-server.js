var WebSocket = require('ws');

var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});

var messages = [];
var topicFlag = false;

console.log('websockets server started');

ws.on('connection', function(socket) {
  console.log('client connection established');

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on('message', function(data) {
    console.log(`message received: ${data}`);
    if (data.substring(0, 6) === '/topic') {
      topic = data.substring(7);
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(`*** Topic has changed to '${data.substring(7)}'`);
      });
      if (topicFlag) {
        messages[0] = `*** Topic is '${data.substring(7)}'`;
      } else {
        messages.unshift(`*** Topic is '${data.substring(7)}'`);
      }
      topicFlag = true;

    } else {
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    }
  });
});
