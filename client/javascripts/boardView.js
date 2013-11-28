var BoardView = function(app) {
  console.log('board view');
  $('#game').attr('page', 'lobby-view');
	
	var currentPlayerNum = 1;
	var goalLocations = [{row: 1, column: 9}, {row: 3, column: 9}, {row: 5, column: 9}];
	
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

	// To keep track of who the current player is and their colour 
	
	var incrementCurrentPlayerNum = function() {
		currentPlayerNum = currentPlayerNum + 1;
		if (currentPlayerNum > app.game.playerCount) {
			currentPlayerNum = 1;
		}		
	};
	
	
  // Once the game start the board is loaded
  app.socket.on('start', function(data) {
    console.log('game started', data);
    
    var visibleRows = data.length;
    
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
    
    var cardHeight = (windowHeight-40)/visibleRows;
    var cardWidth = cardHeight*0.6275; 
    
    $('.board ul li').css({height: cardHeight, width: cardWidth});  
    
    $('#game').attr('page', 'board');
    $('.board').delay(300).queue( function(next){ 
      $(this).css('transform', 'scale(1.3, 0.8) rotateX(10deg)');
      $(this).css('-webkit-transform', 'scale(1.3, 0.8) rotateX(10deg)');
			$(this).css('top', cardHeight*(-0.8));
      next(); 
    });   
		
		$('body').addClass('current-player ' + playerColours[currentPlayerNum]);
	
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
					// console.log('empty space found at row ' + i + 'and column ' + j);
					return ({row: i, column: j});
				};			
			};
		
		};
		console.log('no empty spaces found');
		return null;		
	};

	// checking if it's rotated
	var isRotated = function(row, column) {
	  return $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').hasClass('rotated');
	};
	
	// displaying the card in new location
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
	
	// figuring out location to move to
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

	var highlightCard = function(type, direction) {
		$('.board ul:nth-child('+ currentRow +') .board-card:nth-child('+ currentColumn +')').removeAttr('type');
		if (type === 'column'){
			currentColumn = currentColumn + direction;
		} else if (type === 'row') {
			currentRow = currentRow + direction;
		}
		$('.board ul:nth-child('+ currentRow +') .board-card:nth-child('+ currentColumn +')').attr('type', 'preview');
	}
	
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
   
    if (data.cardType === 'avalanche') {
			if (data.type === 'left' && currentColumn!=0) {
				for (var i = currentColumn; i>0; i--) {
					if (!isSpaceEmpty(currentRow, i) && i != currentColumn) {
							moveDistance = i - currentColumn;
							break;
					}
				}
				highlightCard('column', moveDistance);
			};
				
			// Moving the card right
			if (data.type === 'right' && currentColumn!=maxColumn) {
				for (var i = currentColumn; i<=maxColumn; i++) {					
					if (!isSpaceEmpty(currentRow, i) && i != currentColumn) {
						moveDistance = i - currentColumn;
						break;
					}
				}
				highlightCard('column', moveDistance);
			};
			
			// Move card up
			if (data.type === 'up' && currentRow!=0) {
				for (var i = currentRow; i>0; i--) {
					if (!isSpaceEmpty(i, currentColumn) && i != currentRow) {
						moveDistance = i - currentRow;
						break;
					}
				}
				highlightCard('row', moveDistance);
			};
			
			// Move card down
			if (data.type === 'down' && currentRow!=maxColumn) {
				for (var i = currentRow; i<=maxRow; i++) {
					if (!isSpaceEmpty(i, currentColumn) && i != currentRow) {
						moveDistance = i - currentRow;
						break;
					}
				}
				highlightCard('row', moveDistance);
			};
	   
    };

		if (data.type === 'rotate') {
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').toggleClass('rotated');
		};
  });
  
  app.socket.on('player-action', function (data) { 
    // console.log(data);
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
				$('[type=preview][card]').removeAttr('type');
      }
			if (data.cardType === 'avalanche') {
				console.log('emit avalanche for row ' + currentRow + ' and column ' + currentColumn);
				app.socket.emit('board-action', {type: 'play-avalanche', position: {row: currentRow - 1, column: currentColumn - 1}});
				$('[type=preview][card]').removeAttr('type');
			}
    }
    
    if (data.type === 'back' || data.type === 'discard') {
      if (data.cardType === 'path') {
				console.log('removing card from board do to ' + data.type + ' played');
        $('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').removeClass('rotated');
        displayCard(currentRow, currentColumn, 'null');
      }
      if (data.cardType === 'map') {
        $('.board ul:nth-child('+ (goalLocations[currentRow].row + 1) +') .board-card:nth-child('+ (goalLocations[currentRow].column + 1) +')').attr('type', '');
      }
    }
  });

  app.socket.on('flip goal'), function(data) {
    console.log('flipping goal row:' + data.row + ' column:' + data.column);
    $('.board ul:nth-child('+data.row+') .board-card:nth-child('+data.column+')').addClass('flipped');    
  });
  
	// Player's Turn is Over	
	app.socket.on('next player', function(data) {
		console.log('card accepted by server ' + data);

		$('body').removeClass().addClass('current-player ' + playerColours[currentPlayerNum]);
		
		if ( data.type === 'play' ) {
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').attr('type', 'submitted');      
			isCardConnectedToGoal()
      
		} else if (data.type === 'play-avalanche' || (data.type === 'discard' && typeOfCard(currentCard) === 'path')) {
			displayCard(currentRow, currentColumn, 'null');
		}
		
	});
	
  // Winner code
	app.socket.on('winner', function(data) {
    console.log('We have a winner! ', data);
    
    // TODO: add class to body so show winner   
  });


  app.socket.on('error', function(data) {
		console.log(data);
    if (data === 'invalid play') {
      // Add class to Shake card and then remove the class
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').addClass('invalid-play').delay(800).removeClass('invalid-play');
    }
  });
  
  app.socket.on('player-block-status', function(data) {
    console.log(data);
    console.log(data.blocks);
    
    var playerStatus = $('[playernumber="' + data.playerNumber + '"]');
    
    if (playerStatus.length == 0 ) {
      playerStatus = $('<li />').addClass(((data.isBlocked) ? 'blocked' : '')).attr('playerNumber', data.playerNumber);
      playerStatus.append($('<div />').addClass('player').append($('<div class="playernumber center">player<br>'+ (data.playerNumber+1) +'</div>')));
      $(playerStatus).appendTo('.players-status');
    }
    
    
    if ($('[playernumber="' + data.playerNumber + '"] .blocks').length > 0) {
      console.log('remove block cards');
      $('[playernumber="' + data.playerNumber + '"] .blocks' ).remove();
    }
    
    var playerBlocks = $('<ul />').addClass('blocks');
    console.log('pickaxe: ' + data.blocks.pickaxe);
    console.log('lamp: ' + data.blocks.lamp);
    console.log('cart: ' + data.blocks.cart);
    
    // each block appends to the player blocks
    playerBlocks.append($('<li/>').attr('card', 'block-pickaxe').attr('blocked', data.blocks.pickaxe));
    playerBlocks.append($('<li/>').attr('card', 'block-lamp').attr('blocked', data.blocks.lamp));
    playerBlocks.append($('<li/>').attr('card', 'block-cart').attr('blocked', data.blocks.cart));
    
    playerBlocks.appendTo(playerStatus);
    
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
		// console.log(goalLocations);
		$('.board ul:nth-child('+ (goalLocations[currentRow].row + 1) +') .board-card:nth-child('+ (goalLocations[currentRow].column + 1) +')').attr('type', 'preview');
	});
  
  app.socket.on('avalanche-card', function(data) {
		console.log(data)
    currentRow = data.row + 1;
    currentColumn = data.column + 1;
    $('.board ul:nth-child('+ currentRow +') .board-card:nth-child('+ currentColumn	+')').attr('type', 'preview');
  });
  
};
