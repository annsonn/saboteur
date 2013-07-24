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

  // handling what happens when you click card from hand view
  var bindCardClick = function() {
     $('.card').unbind('click');
     
    $('.card').click(function() {
      $('.play-card > div').removeAttr('card').removeClass();
      $('.play-card > div').attr('card', $(this).attr('card')).addClass('selected-card');
      
      // disables rotate if not a map card
      if ($('.selected-card[card*=connected]').length === 0 && $('.selected-card[card*=deadend]').length === 0) {
        $('.rotate-button').css('background-color', 'grey');
        $('.rotate-button').unbind('click');
      } else {
        $('.rotate-button').click(function() {    
          $('.selected-card').toggleClass('rotated');            
          app.socket.emit('card-action', {type: 'rotate'});  
        });
      }
      
      var card = $(this).attr('card');
			var cardType = 'map';
			
			if (card.indexOf('free') >= 0 || card.indexOf('block') >= 0) {
				console.log('previwing an action card!');
				cardType = 'action';
			};
      
      // updates play button based on card picked
      $('.play-button').click(function() {
				unbindButtons();
			
				// removing card from hand
				$('.hand [card='+$('.selected-card').attr('card')+']').first().remove();
        app.socket.emit('player-action', {card: card, type: 'submit', cardType: cardType});            
				$('#game').attr('page', 'hand');
      });
      
      app.socket.emit('player-action', {card: card, type: 'preview', cardType: cardType});
      
      $('#game').attr('page', 'play-card');
    });
  };
  
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
      list.append($('<li />').attr('card', card).addClass('card'));
    });
    
    $('.hand').html(list); // or $('.hand').append(list) to add to existing cards    
    
    $('.hand').css('width', window.innerWidth-45);
    $('.hand ul').css('width', window.innerWidth-45);
    
    bindCardClick();
    
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
  
	var unbindButtons = function() {
		$('.rotate-button').unbind('click');
    $('.play-button').unbind('click');
		
    if ($('.selected-card[card*=connected]').length === 0 && $('.selected-card[card*=deadend]').length === 0) {
      $('.rotate-button').css('background-color', '');
    } else {       
      if ($('rotated')) {
        $('.selected-card').toggleClass('rotated');  
      }
    }
	};
	
  $('.back-button').click(function() {
    unbindButtons();
    
    // telling server that the card needs to be removed from board view
    app.socket.emit('player-action', {type: 'back'});
    $('#game').attr('page', 'hand');
  });
  
	$('.discard-button').click(function() {
    unbindButtons();
    
    // telling server that the card needs to be removed from board view
		$('.hand [card='+$('.selected-card').attr('card')+']').first().remove();
    app.socket.emit('player-action', {card: $('.selected-card').attr('card'), type: 'discard'});
		$('#game').attr('page', 'hand');
	});
	
  $('.left-button').click(function() {
    app.socket.emit('card-action', {type: 'left', cardType: ($('.selected-card').attr('card').indexOf('free') >= 0 || $('.selected-card').attr('card').indexOf('block') >= 0) ? 'action' : 'map'});
  });
  $('.right-button').click(function() {
    app.socket.emit('card-action', {type: 'right', cardType: ($('.selected-card').attr('card').indexOf('free') >= 0 || $('.selected-card').attr('card').indexOf('block') >= 0) ? 'action' : 'map'});
  });
  $('.up-button').click(function() {
    app.socket.emit('card-action', {type: 'up', cardType: ($('.selected-card').attr('card').indexOf('free') >= 0 || $('.selected-card').attr('card').indexOf('block') >= 0) ? 'action' : 'map'});
  });
  $('.down-button').click(function() {
    app.socket.emit('card-action', {type: 'down', cardType: ($('.selected-card').attr('card').indexOf('free') >= 0 || $('.selected-card').attr('card').indexOf('block') >= 0) ? 'action' : 'map'});
  });  
	
	app.socket.on('deal', function(data) {
			$('.hand ul').append($('<li />').attr('card', data.card).addClass('card'));
      bindCardClick();
  });
	
};
