//Add express for simplified http server
var express = require('express');
//Let socket.io handle WebSockets
var sio = require('socket.io');

var request = require('request');

//Initiate http server
var app = express();

var setTopBoxIP = 'http://10.10.60.135';

//Include static HTML in the 'public' directory
app.use(express.static('public'));

//Start the http server on port 4005
var server = app.listen(4005);
server.listen(4005, function() {
    console.log('Server listening at http://localhost:4005/');
});

app.get('/health', function(req, res) {
  console.info('Still alive!');
  res.status(200).send('work work');
});

app.get('/api/notification', function(req, res) {
  console.log('sending notification to DirectTV');
  // TODO: change view in DirectTV and view video
});

// Attach the socket.io server to the http server
var io = sio.listen(server);

// Define a message handler
io.on('connection', function(socket) {
  console.debug('Someone conected');

  socket.on('ping', function(data) {
    socket.emit('pong');
  });
});
