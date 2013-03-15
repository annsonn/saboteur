/*
var socket = io.connect();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
*/

// Connect to server
var socket = io.connect();

var canvas = document.getElementById("canvas");
      
var stage = new createjs.Stage(canvas);

// Loading screen
socket.on('connect', function (data) {
  console.log(data);
  $('#game').attr('page', 'lobby'); 
});
