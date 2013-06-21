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
    
    var visbleRows = data.length;
    
    for (var i = 0; i < data.length; i++) {
      var boardRow = $('<ul />');
      
      for (var j in data[i]) {
        boardRow.append($('<li />').addClass(data[i][j] + ' board-card'));        
      };
       
      $(boardRow).appendTo('.board');
      
      if ( (i==0 || i==(data.length-1) ) && $('.board ul:nth-child('+(i + 1)+') .null').length == data[i].length) {
        boardRow.css('display', 'none');
        visbleRows--;
      }
    };
    
    var cardHeight = (windowHeight-50)/visbleRows;
    var cardWidth = cardHeight*0.6275; 
    
    $('.board ul li').css({height: cardHeight, width: cardWidth});  
    
    $('#game').attr('page', 'board');
    $('.board').delay(300).queue( function(next){ 
      $(this).css('transform', 'scale(1,1)');
      $(this).css('-webkit-transform', 'scale(1,1)');
      next(); 
    });   
    
  });
  
  app.socket.on('card-action', function (data) {  
    console.log('card-action', data);
  });
  
  app.socket.on('player-action', function (data) {  
    console.log('player-action', data);
  });
};
