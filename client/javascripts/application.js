/*
var socket = io.connect();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
*/

// Connect to server
var socket = io.connect();
var playerId;
// Loading screen

socket.on('connect', function (data) {
  console.log(data);
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('#game').attr('page', 'lobby-controller');
  } else {
    $('#game').attr('page', 'lobby-view');   
  }	
});

socket.on('identity', function (data) {
	console.log(data);
  playerId = data.playerId;
}

socket.on('joined', function (data) {
  var playerColours = ( "red", "orange", "yellow", "green", "blue", "purple", "white", "black" );
  console.log(data.game.name);
  console.log(data.playerId);

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('#game').attr('page', 'join-mobile');
  } else {
  	$('#game').attr('page', 'join');
		$('#gameid').append(data.game.name);
    
  }
  
                       
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