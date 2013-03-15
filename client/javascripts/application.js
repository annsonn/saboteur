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
  if (window.innerWidth < 767) {
    $('#game').attr('page', 'lobby-controller');
  } else {
    $('#game').attr('page', 'lobby-view'); 
  }
});
