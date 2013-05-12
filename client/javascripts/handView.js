var HandView = function(app) {
  console.log('hand view');
  
  $('#game').attr('page', 'lobby-controller');
  $('#join-game').click(function(event) {
    app.socket.emit('join', $('#input-code').val());
  })
  $('.ready-button').click(function(event) {
    if (app.game.playerCount >= 3) {
      $('.ready-button').hide();
      console.log('triggered start game');
      app.socket.emit('start');
    }
  });

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
        $('.ready-button').hide();
      } else {
        app.player.isHost = true;
      }
    }
    if (app.player.isHost && app.game.playerCount >= 3) {
      $('.ready-button').text('Start Game');
    }
  });

  app.socket.on('start', function(data) {
    console.log('game started', data);
    
    if (data.job == "gold-digger") {
      $('.flip-card-back').append('<img src="/images/job-miner.jpg"/>');  
    }
    if (data.job == "saboteur") {
       $('.flip-card-back').append('<img src="/images/job-saboteur.jpg"/>'); 
    }
    
    // To Do:
    //append the hand to the next screen
    var hand = [];
    hand.push('<ul>');
    
    for (var i = 0; i < data.hand.length; i++) {
      hand.push('<li><span>' + data.hand[i] + '</span></li>');
    }
    hand.push('</ul>');
    
    $('.hand').append( hand.join('') );
    
    $('#game').attr('page', 'choose-role');
  });
  
  $('.job-card').click(function() {
    // flip cards
    $('.job-card').addClass('flip');
    
    $('.job-card').click(function() {
       $('#game').attr('page', 'hand');
    });
  });
  
};
