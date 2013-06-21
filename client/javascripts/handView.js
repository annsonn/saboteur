var HandView = function(app) {
  console.log('hand view');
  
  $('#game').attr('page', 'lobby-controller');
  $('#join-game').click(function(event) {
    app.socket.emit('join', $('#input-code').val());
  });
  $('.ready-button').click(function(event) {
    if (app.game.playerCount >= 3) {
      $('.ready-button').hide();
      console.log('triggered start game');
      app.socket.emit('start');
    }
  });

  $('#input-code').keydown(function(event) {
    if (event.keyCode === 13) {
      console.log('pressed enter');
      $('#join-game').click();
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
  
  app.socket.on('game-full', function(data) {
      console.log(data);
  });

  // Game Screens
  app.socket.on('start', function(data) {
    console.log('game started', data);
    
    if (data.job == "gold-digger") {
      $('.flip-card-back').append('<img src="/images/job-miner.jpg"/>');  
    }
    if (data.job == "saboteur") {
       $('.flip-card-back').append('<img src="/images/job-saboteur.jpg"/>'); 
    } 
    
    var list = $('<ul />');
    data.hand.forEach(function(card) {
      list.append($('<li />').addClass(card + ' playing-card'));
    });
    
    $('.hand').html(list); // or $('.hand').append(list) to add to existing cards    
    
    $('.hand').css('width', window.innerWidth-65);
    $('.hand ul').css('width', window.innerWidth-65);
    
    
    // handling what happens when you click card from hand view
    $('.playing-card').click(function() {
      $('.play-card > div').removeClass();
      $('.play-card > div').addClass($(this).attr('class') + ' selected-card');
      
      // disables rotate if not a map card
      if ($('.selected-card[class*=connected]').length === 0 && $('.selected-card[class*=deadend]').length === 0) {
        $('.rotate-button').css('background-color', 'grey');
        $('.rotate-button').unbind('click');
      } else {
        $('.rotate-button').click(function() {    
          $('.selected-card').toggleClass('rotated');            
          app.socket.emit('card-action', {type: 'rotate'});  
        });
      }
      
      // updates play button based on card picked
      $('.play-button').click(function() {
        var card = $('.selected-card').clone().removeClass('playing-card selected-card').attr('class');
        app.socket.emit('player-action', {card: card, type: 'submit'});            
      });
      
      var card = $(this).clone().removeClass('playing-card').attr('class');
      app.socket.emit('player-action', {card: card, type: 'preview'});
      
      $('#game').attr('page', 'play-card');
    });
    
    $('#game').attr('page', 'choose-role');
  });
    
  $('.job-card').click(function() {
    // flip cards
    $('.job-card').addClass('flip');
    
    $('.job-card').click(function() {
      $('#game').attr('page', 'hand');
      $('.hand').fadeIn(400).delay(300).queue( function(next){ 
        $(this).css('left', '0');
        next(); 
      });
    });
  });  
  
  $('.back-button').click(function() {
    $('#game').attr('page', 'hand');
     $('.rotate-button').unbind('click');
    
    if ($('.selected-card[class*=connected]').length === 0 && $('.selected-card[class*=deadend]').length === 0) {
      $('.rotate-button').css('background-color', '');
    } else {
      $('.rotate-button').click(function() {    
        if ($('rotated')) {
          $('.selected-card').toggleClass('rotated');  
        }
      });
    }
    app.socket.emit('player-action', {type: 'back'});
  });
  
  $('.left-button').click(function() {
    app.socket.emit('card-action', {type: 'left'});
  });
  $('.right-button').click(function() {
    app.socket.emit('card-action', {type: 'right'});
  });
  $('.up-button').click(function() {
    app.socket.emit('card-action', {type: 'up'});
  });
  $('.down-button').click(function() {
    app.socket.emit('card-action', {type: 'down'});
  });  
  
  
  
};
