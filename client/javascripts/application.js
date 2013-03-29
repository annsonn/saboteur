// Connect to server
var socket = io.connect();
var playerId;
var playerCount = 0;
var playerColours = new Array ( "", "red", "orange", "yellow", "green", "blue", "purple", "white", "black" );

// Loading screen
socket.on('connect', function (data) {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('#game').attr('page', 'lobby-controller');
  } else {
    $('#game').attr('page', 'lobby-view');   
  }	
});

// Getting Player Name
socket.on('identity', function (data) {
  playerId = data;
});

// Waiting/Joining Screens
socket.on('joined', function (data) {  
  console.log(data);
	playerCount = data.game.players.length - 1;
  console.log("num players: " + playerCount);
	
  if (playerId == data.playerId) {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
      $('#game').attr('page', 'join-mobile');
      $('#join-mobile .screen').css({
         "background": "-webkit-radial-gradient(circle, transparent, "+playerColours[playerCount]+")"
      });
      $('.player-text').append(playerCount);
      if (playerCount > 1) {
        $('.ready-button').css({ "display":"none"});
      }
    } else {
      $('#game').attr('page', 'join');
      $('#gameid').append(data.game.name);
    }
  } else {
    if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {      
      $('.player:nth-child('+playerCount+')').css({
        "opacity":"0.8",
        "-webkit-filter": "blur(0px)",
        "-webkit-transform": "scale(1.2, 1.2)"
      });
      $('.player:nth-child('+playerCount+') .colour').css({
        "background": "-webkit-radial-gradient(circle, transparent, "+playerColours[playerCount]+")"
      });
    }
  }
});

// Used to adjust borders on mobile
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