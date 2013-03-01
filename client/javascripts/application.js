/*
var socket = io.connect();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
*/

// Connect to server
var socket = io.connect();

// Listen for acknoledgement

// Draw initial screens
var context = document.querySelector('#game').getContext('2d');

// Listen for more stuff and react
// Listen for state