//Add express for simplified http server
var express = require('express');
//Let socket.io handle WebSockets
var sio = require('socket.io');

var request = require('request');

//Initiate http server
var app = express();

var setTopBoxIP = 'http://10.10.31.22';
var serverIp = 'http://10.10.31.21:4005';

//Include static HTML in the 'public' directory
app.use(express.static('public'));
app.use('/video', express.static('hls-example'));

function changeToVideoView() {
    request(setTopBoxIP + ':8080/itv/startURL?url=' + serverIp + '/video', function(err1, res1, body1) {
        if (!err1 && res1.statusCode == 200) {

        } else {
          console.log('Change to video view does not work.');
        }
    });
}

function backToNormalView() {
    request(setTopBoxIP + ':8080/itv/startURL?url=' + serverIp, function(err1, res1, body1) {
        if (!err1 && res1.statusCode == 200) {

        } else {
          console.log('Back to normal view does not work.');
        }
    });
}

function stopView() {
  request(setTopBoxIP + ':8080/itv/stopITV', function(err1, res1, body1) {
      if (!err1 && res1.statusCode == 200) {

      } else {
        console.log('We cannot stop the itv app.');
      }
  });
}

//Start the http server on port 4005
var server = app.listen(4005);
server.listen(4005, function() {
    console.log('Server listening at http://localhost:4005/');
});

app.get('/health', function(req, res) {
  console.log('Still alive!');
  res.status(200).send('work work');
});

app.get('/api/tv/view/video', function(req, res) {
  console.log('Changing view to video');
  changeToVideoView();
});
app.get('/api/tv/view', function(req, res) {
  console.log('Changing view to normal');
  backToNormalView();
});
app.get('/api/tv/view/stop', function(req, res) {
  console.log('Stopping ITV app');
  stopView();
});

app.get('/api/notification', function(req, res) {
  console.log('sending notification to DirectTV');
  // TODO: change view in DirectTV and view video
});

// Attach the socket.io server to the http server
var io = sio.listen(server);

// Define a message handler
io.on('connection', function(socket) {
  console.log('Someone conected');

  socket.on('ping', function(data) {
    socket.emit('pong');
  });
});
