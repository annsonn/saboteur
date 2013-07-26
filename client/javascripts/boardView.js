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

  // Once the game start the board is loaded
  app.socket.on('start', function(data) {
    console.log('game started', data);
    
    var visbleRows = data.length;
    
    for (var i = 0; i < data.length; i++) {
      var boardRow = $('<ul />');
      
      for (var j in data[i]) {
				if (data[i][j] == null) {
					boardRow.append($('<li />').attr('type', 'preview').addClass('board-card'));
				} else {
					boardRow.append($('<li />').attr('card', data[i][j]).addClass('board-card'));        
				}
      };
       
      $(boardRow).appendTo('.board');
    };
    
    var cardHeight = (windowHeight-40)/visbleRows;
    var cardWidth = cardHeight*0.6275; 
    
    $('.board ul li').css({height: cardHeight, width: cardWidth});  
    
    $('#game').attr('page', 'board');
    $('.board').delay(300).queue( function(next){ 
      $(this).css('transform', 'scale(1.3, 0.8) rotateX(10deg)');
      $(this).css('-webkit-transform', 'scale(1.3, 0.8) rotateX(10deg)');
			$(this).css('top', cardHeight*(-0.8));
      next(); 
    });   
    
  });
  
	
	// Stuff to deal with play cards onto the board 
	var maxRow = 7;
	var maxColumn = 11;
	
	var currentRow = 0;
	var currentColumn = 0;
	var currentCard = 'null';
	
	var isSpaceEmpty = function(row, column) {
		return (!$('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').attr('card'));		
	};
	
	var getEmptySpace = function() {
		for (var i = 1; i <= maxRow; i++ ) {
			for (var j =1; j<= maxColumn; j++ ) {
				if (isSpaceEmpty(i, j)) {
					console.log('empty space found at row ' + i + 'and column ' + j);
					return ({row: i, column: j});
				};			
			};
		
		};
		console.log('no empty spaces found');
		return null;		
	};

  var isRotated = function(row, column) {
    return $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').hasClass('rotated');
  };
	
	var displayCard = function(row, column, card) {
    if (card == 'null') {
      $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').removeAttr('card');		
    } else {
      $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').attr('card', card);		  
    };
		
		if (isRotated(row, column)) {
			$('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').toggleClass('rotated');
			return {rotated: true};
		}
		return {rotated: false};
	};
	
	var move = function(type, direction) {
		if (type === 'column') {
			if (displayCard(currentRow, currentColumn, 'null').rotated) {
				$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+(currentColumn + direction)+')').toggleClass('rotated');
			};
      displayCard(currentRow, currentColumn + direction, currentCard);
			currentColumn = currentColumn + direction;
		};
		if (type === 'row') {
			if (displayCard(currentRow, currentColumn, 'null').rotated) {
				$('.board ul:nth-child('+(currentRow + direction)+') .board-card:nth-child('+currentColumn+')').toggleClass('rotated');
			};
      displayCard(currentRow + direction, currentColumn, currentCard);
			currentRow = currentRow + direction;
		}
	};	

  app.socket.on('card-action', function (data) {  	
    //add just for moving between players to block/free

    var moveDistance = 0;    
    
    if (data.cardType == 'path') {
      // Moving the card left
      if (data.type === 'left' && currentColumn!=0) {
        for (var i = currentColumn; i>0; i--) {
          if (isSpaceEmpty(currentRow, i)) {
            moveDistance = i - currentColumn;
            break;
          }
        }
        move('column', moveDistance);
      };
      
      // Moving the card right
      if (data.type === 'right' && currentColumn!=maxColumn) {
        for (var i = currentColumn; i<=maxColumn; i++) {
          if (isSpaceEmpty(currentRow, i)) {
            moveDistance = i - currentColumn;
            break;
          }
        }
        move('column', moveDistance);
      };
      
      // Move card up
      if (data.type === 'up' && currentColumn!=0) {
        for (var i = currentRow; i>0; i--) {
          if (isSpaceEmpty(i, currentColumn)) {
            moveDistance = i - currentRow;
            break;
          }
        }
        move('row', moveDistance);
      };
      
      // Move card down
      if (data.type === 'down' && currentColumn!=maxColumn) {
        for (var i = currentRow; i<=maxRow; i++) {
          if (isSpaceEmpty(i, currentColumn)) {
            moveDistance = i - currentRow;
            break;
          }
        }
        move('row', moveDistance);
      };
    }
    
    if (data.cardType == 'action') {
      
      if (data.type === 'right' || data.type === 'down') {
        $('li[playernumber]:nth-child(' + currentColumn + ')').attr('selected', false);
        currentColumn++;
        if (currentColumn > $('li[playernumber]').length) {
          currentColumn = 1;
        }
        $('li[playernumber]:nth-child(' + currentColumn + ')').attr('selected', true);
      }
      
      if (data.type === 'left' || data.type === 'up') {
        $('li[playernumber]:nth-child(' + currentColumn + ')').attr('selected', false);
        currentColumn--;
        if (currentColumn == 0) {
          currentColumn = $('li[playernumber]').length;
        }
        $('li[playernumber]:nth-child(' + currentColumn + ')').attr('selected', true);      
      }
    }
      
		if (data.type === 'rotate') {
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').toggleClass('rotated');
		};
  });
  
  app.socket.on('player-action', function (data) { 
    $('#game').attr('page', 'board'); // regardless of view goes back to the board view
    
		if (data.type === 'preview') {
			currentCard = data.card;
			currentRow = getEmptySpace().row; 
			currentColumn = getEmptySpace().column;
			displayCard(currentRow, currentColumn, currentCard);
		}
    
    if (data.type === 'submit') {
      console.log(data);
      if (data.cardType === 'path') {
        // Submit to server for validity
        var rotated = isRotated(currentRow, currentColumn);
        app.socket.emit('board-action', {type: 'play', card: currentCard, position: {row: currentRow - 1, column: currentColumn - 1, rotated: rotated}});
      }
      if (data.cardType === 'action') {
        app.socket.emit('board-action', {type: 'play-action', card: $('#selected-action-card').attr('card'), target: $('[playernumber][selected]').attr('playernumber')}); 
      }
    }
    
    if (data.type === 'back' || data.type === 'discard') {
      $('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').removeClass('rotated');
      displayCard(currentRow, currentColumn, 'null');
    }
  });

	app.socket.on('next player', function(data) {
		console.log('card accepted by server');
		$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').attr('type', 'submitted');
	});
	
  app.socket.on('error', function(data) {
		console.log(data);
    if (data === 'invalid play') {
      // Add class to Shake card and then remove the class
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').addClass('invalid-play').delay(800).removeClass('invalid-play');
    }
  });
  
  app.socket.on('player-block-status', function(data) {
  
    if ($('[playernumber="' + data.playerNumber + '"]').length == 0 ) {
      var playerStatus = $('<li />').addClass(((data.isBlocked) ? 'blocked' : '')).attr('playerNumber', data.playerNumber);
      playerStatus.append($('<div />').addClass('player').append($('<div class="playernumber center">player<br>'+ (data.playerNumber+1) +'</div>')));
      var playerBlocks = $('<ul />').addClass('blocks');
      console.log(data.blocks);
      
      // each block appeds to the player blocks
      playerBlocks.append($('<li/>').attr('card', 'block-pickaxe').attr('blocked', (data.blocks.pickaxe) ? 'true' : 'false'));
      playerBlocks.append($('<li/>').attr('card', 'block-lamp').attr('blocked', (data.blocks.lamp) ? 'true' : 'false'));
      playerBlocks.append($('<li/>').attr('card', 'block-cart').attr('blocked', (data.blocks.cart) ? 'true' : 'false'));
  
      playerBlocks.appendTo(playerStatus);
      $(playerStatus).appendTo('.players-status');
    }
  });
  
  app.socket.on('player-action-card', function(data) {
    currentColumn = 1;

    $('li[playernumber]:nth-child(' + currentColumn + ')').attr('selected', true);
    $('#selected-action-card').attr('card', data.card);
    $('#game').attr('page', 'player-action');
  });

};
