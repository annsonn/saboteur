var playerColours = new Array ( "", "red", "orange", "yellow", "green", "blue", "purple", "white", "black" );

var Application = function() {
  var app = {
    socket: io.connect(), // Connect to server
    player: {
      id: null,
      isHost: false
    },
    game: {
      playerCount: 0
    },
  };

  // Getting Player Name
  app.socket.on('identity', function (data) {
    app.player.id = data;
  });

  // Loading screen
  app.socket.on('connect', function (data) {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|Playbook/i.test(navigator.userAgent) ) {
      new HandView(app);
    } else {
      new BoardView(app);
    }	
  });
 
  return app;
}

// Used to adjust borders on mobile
var windowHeight = window.innerHeight-50;
var windowWidth = window.innerWidth-50;
var cardHeight = (windowHeight-50)/7;
var cardWidth = cardHeight*0.6275;
$('.screen').css('height', windowHeight + 'px')
$('.screen').css('width', windowWidth + 'px')

window.onresize = function(event) {
  windowHeight = window.innerHeight-50;
  windowWidth = window.innerWidth-50;
  cardHeight = (windowHeight-50)/7;
  cardWidth = cardHeight*0.6275;
  
  $('.screen').css('height', windowHeight + 'px')
  $('.screen').css('width', windowWidth + 'px')
  $('.hand').css('width', window.innerWidth-65);
  $('.hand ul').css('width', window.innerWidth-65);
  if ($('.board li')) {
    $('.board li').css({height: cardHeight, width: cardWidth});
  }
};

var application = new Application();
