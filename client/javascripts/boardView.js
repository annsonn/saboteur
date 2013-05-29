var BoardView = function(app) {
  console.log('board view');
  $('#game').attr('page', 'lobby-view');

  $('#create-game').click(function(event) {
    app.socket.emit('create');
  })
  
  // Waiting Screens
  app.socket.on('joined', function (data) {  
    console.log(data);
    app.game.playerCount = data.game.players.length - 1;
    console.log("num players: " + app.game.playerCount);
    
    if (app.player.id == data.playerId) {
      $('#game').attr('page', 'join');
      $('#gameid').append(data.game.name);
    } else {
      $('.player:nth-child('+app.game.playerCount+')').addClass('player-joined');
      $('.player:nth-child('+app.game.playerCount+') .colour').css({
        "background": "-webkit-radial-gradient(circle, transparent, "+playerColours[app.game.playerCount]+")"
      });
    }
  });

  app.socket.on('start', function(data) {
    console.log('game started', data);
      
    for (var i = 0; i < data.length; i++) {
      var boardRow = $('<ul />');
      var emptyRowCount = 0;
      
      for (var j in data[i]) {
        boardRow.append($('<li />').addClass(data[i][j] + ' board-card'));
        
        if ( data[i][j] === null && (i === 0 || i === 6 ) ){
          emptyRowCount++;
        }        
      };
      
      if (emptyRowCount === 11) {
        boardRow.css('display', 'none');
      }
      
      
      $(boardRow).appendTo('.board');
    };
    
    $('#game').attr('page', 'board');
    $('.board').delay(300).queue( function(next){ 
      $(this).css('transform', 'scale(1,1)');
      $(this).css('-webkit-transform', 'scale(1,1)');
      next(); 
    });
   
  });
};
