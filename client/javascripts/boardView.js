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
	var goalLocations = [];
	
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
	
	var displayCard = function(row, column, card, rotated) {
    if (card == 'null') {
      $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').removeAttr('card');
			$('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').removeClass('rotated');
    } else {
      $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').attr('card', card); 
			if (rotated) {
				$('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').addClass('rotated');
			}
    };
	};
	
	var move = function(type, direction) {
		var rotated = isRotated(currentRow, currentColumn);

		if (type === 'column') {
			displayCard(currentRow, currentColumn, 'null');
			displayCard(currentRow, currentColumn + direction, currentCard, rotated);
			
			currentColumn = currentColumn + direction;
		} else if (type === 'row') {
			displayCard(currentRow, currentColumn, 'null');
			displayCard(currentRow + direction, currentColumn, currentCard, rotated);
			
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
      $('li[playernumber]:nth-child(' + currentColumn + ')').attr('selected', false);
      
      if (data.type === 'right' || data.type === 'down') {
        currentColumn++;
        if (currentColumn > $('li[playernumber]').length) {
          currentColumn = 1;
        }
      }      
      
      if (data.type === 'left' || data.type === 'up') {
        currentColumn--;
        if (currentColumn == 0) {
          currentColumn = $('li[playernumber]').length;
        }    
      }
      
      $('li[playernumber]:nth-child(' + currentColumn + ')').attr('selected', true);
    }

    if (data.cardType == 'map') {
       $('.board ul:nth-child('+ (goalLocations[currentRow].row + 1) +') .board-card:nth-child('+ (goalLocations[currentRow].column + 1) +')').attr('type', '');
       
       if (data.type === 'right' || data.type === 'down') {
        currentRow++;
        if (currentRow == goalLocations.length) {
          currentRow = 0;
        }
      }      
      
      if (data.type === 'left' || data.type === 'up') {
        currentRow--;
        if (currentRow < 0) {
          currentRow = goalLocations.length-1;
        }    
      }
      
      $('.board ul:nth-child('+ (goalLocations[currentRow].row + 1) +') .board-card:nth-child('+ (goalLocations[currentRow].column + 1) +')').attr('type', 'preview');
    }
    
		if (data.type === 'rotate') {
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').toggleClass('rotated');
		};
  });
  
  app.socket.on('player-action', function (data) { 
    console.log(data);
    $('#game').attr('page', 'board'); // regardless of view goes back to the board view
    
		if (data.type === 'preview') {
			currentCard = data.card;
			currentRow = getEmptySpace().row; 
			currentColumn = getEmptySpace().column;
			displayCard(currentRow, currentColumn, currentCard);
		}
    
    if (data.type === 'submit') {
      if (data.cardType === 'path') {
        // Submit to server for validity
        var rotated = isRotated(currentRow, currentColumn);
        app.socket.emit('board-action', {type: 'play', card: currentCard, position: {row: currentRow - 1, column: currentColumn - 1, rotated: rotated}});
      }
      if (data.cardType === 'action') {
        app.socket.emit('board-action', {type: 'play-action', card: $('#selected-action-card').attr('card'), target: $('[playernumber][selected]').attr('playernumber')}); 
      }
      if (data.cardType === 'map') {
        console.log('emit ' + $('[type=preview][card]').attr('card') + ' to server to send to current player');
        app.socket.emit('board-action', {type: 'play-map', card: $('[type=preview][card]').attr('card')});
      }
    }
    
    if (data.type === 'back' || data.type === 'discard') {
      if (data.cardType === 'path') {
        $('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').removeClass('rotated');
        displayCard(currentRow, currentColumn, 'null');
      }
      if (data.cardType === 'map') {
        $('.board ul:nth-child('+ (goalLocations[currentRow].row + 1) +') .board-card:nth-child('+ (goalLocations[currentRow].column + 1) +')').attr('type', '');
      }
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
      
      // each block appends to the player blocks
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

	app.socket.on('map-card', function(data) {
		goalLocations = data;    
    currentRow = 0;
		console.log(goalLocations);
		$('.board ul:nth-child('+ (goalLocations[currentRow].row + 1) +') .board-card:nth-child('+ (goalLocations[currentRow].column + 1) +')').attr('type', 'preview');
	});
  
};
