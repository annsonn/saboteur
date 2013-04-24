var HandView = function(app) {
  console.log('hand view');
  
  $('#game').attr('page', 'lobby-controller');
  $('#join-game').click(function(event) {
    app.socket.emit('join', $('#input-code').val());
  })

  // Joining Screens
  app.socket.on('joined', function (data) {  
    console.log(data);
    app.game.playerCount = data.game.players.length - 1;
    console.log("num players: " + app.game.playerCount);
    
    if (app.player.id == data.playerId) {
      $('#game').attr('page', 'join-mobile');
      $('#join-mobile .screen').css({
         "background": "-webkit-radial-gradient(circle, transparent, " + playerColours[app.game.playerCount] + ")"
      });
      $('.player-text').append(app.game.playerCount);
      if (app.game.playerCount > 1) {
        $('.ready-button').css({ "display":"none"});
      }
    }
  });
  
};
