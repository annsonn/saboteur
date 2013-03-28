/*
var socket = io.connect();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
*/

// Connect to server
var socket = io.connect();

// Loading screen

socket.on('connect', function (data) {
  console.log(data);
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('#game').attr('page', 'lobby-controller');
  } else {
    $('#game').attr('page', 'lobby-view');   
  }	
});

socket.on('created', function (data) {
  $('#game').attr('page', 'join');
  console.log(data.name);
  $('#gameid').append(data.name);
});

function getPlayerCount() {
  var i = 0; 
  return function() {
    i++;
  }
}

socket.on('joined', function (data) {
  var players = getPlayerCount();
  var playerColours = ( "red", "orange", "yellow", "green", "blue", "purple", "white", "black" );
  
  $('#game').attr('page', 'join-mobile');
  console.log(data.player);
                       
/* 
 if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.player:nth-child('+players+')').css({
      'opacity': '0.8',
  		'-webkit-filter': "blur(0px)",
  		'-webkit-transform': "scale(1.2, 1.2)"
    });
  }
*/
});

var windowHeight = window.innerHeight-50;
var windowWidth = window.innerWidth-50;
$('.screen').css('height', windowHeight + 'px')
$('.screen').css('width', windowWidth + 'px')

window.onresize = function(event) {
	windowHeight = window.innerHeight-50;
  windowWidth = window.innerWidth-50;
  $('.screen').css('height', windowHeight + 'px')
  $('.screen').css('width', windowWidth + 'px')
};