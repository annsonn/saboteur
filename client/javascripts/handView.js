var HandView = function(app) {
  $('#game').attr('page', 'lobby-view');
  
  // Waiting/Joining Screens
  app.socket.on('joined', function (data) {  
    console.log(data);
    app.game.playerCount = data.game.players.length - 1;
    console.log("num players: " + app.game.playerCount);
    
    if (app.player.id == data.playerId) {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|Playbook/i.test(navigator.userAgent) ) {
        $('#game').attr('page', 'join-mobile');
        $('#join-mobile .screen').css({
           "background": "-webkit-radial-gradient(circle, transparent, " + playerColours[app.game.playerCount] + ")"
        });
        $('.player-text').append(app.game.playerCount);
        if (app.game.playerCount > 1) {
          $('.ready-button').css({ "display":"none"});
        }
      } else {
        $('#game').attr('page', 'join');
        $('#gameid').append(data.game.name);
      }
    } else {
      if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|Playbook/i.test(navigator.userAgent) ) {
        $('.player:nth-child('+app.game.playerCount+')').addClass('player-joined');
        $('.player:nth-child('+app.game.playerCount+') .colour').css({
          "background": "-webkit-radial-gradient(circle, transparent, "+playerColours[app.game.playerCount]+")"
        });
      }
    }
  });
  
};
