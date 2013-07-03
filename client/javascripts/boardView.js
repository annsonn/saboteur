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
	
	var currentRow;
	var currentColumn;
	var currentCard;
	
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
	
	var displayCard = function(row, column, card) {
    if (card == 'null') {
      $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').removeAttr('card');		
    } else {
      $('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').attr('card', card);		  
    };
		
		if ($('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').hasClass('rotated')) {
			$('.board ul:nth-child('+row+') .board-card:nth-child('+column+')').toggleClass('rotated');
			return {rotated: true};
		}
		return {rotated: false};
	};
	
	var move = function(type, direction) {
		if (type === 'column') {
			displayCard(currentRow, currentColumn + direction, currentCard);
			if (displayCard(currentRow, currentColumn, 'null').rotated) {
				$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+(currentColumn + direction)+')').toggleClass('rotated');
			};
			currentColumn = currentColumn + direction;
		};
		if (type === 'row') {
			displayCard(currentRow + direction, currentColumn, currentCard);
			if (displayCard(currentRow, currentColumn, 'null').rotated) {
				$('.board ul:nth-child('+(currentRow + direction)+') .board-card:nth-child('+currentColumn+')').toggleClass('rotated');
			};
			currentRow = currentRow + direction;
		}
	};	

  app.socket.on('card-action', function (data) {  		
		// Moving the card left
		if (data.type === 'left' && currentColumn!=0 && isSpaceEmpty(currentRow, currentColumn-1)) {
			move('column', -1);
		};
		
		// Moving the card right
		if (data.type === 'right' && currentColumn!=maxColumn && isSpaceEmpty(currentRow, currentColumn+1)) {
			move('column', 1);
		};
		
		// Move card up
		if (data.type === 'up' && currentColumn!=0 && isSpaceEmpty(currentRow-1, currentColumn)) {
			move('row', -1);
		};
		
		// Move card down
		if (data.type === 'down' && currentColumn!=maxColumn && isSpaceEmpty(currentRow+1, currentColumn)) {
			move('row', 1);
		};
		
		if (data.type === 'rotate') {
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').toggleClass('rotated');
		};
  });
  
  app.socket.on('player-action', function (data) {  		
		if (data.type === 'preview') {
			currentCard = data.card;
			currentRow = getEmptySpace().row; 
			currentColumn = getEmptySpace().column;
			displayCard(currentRow, currentColumn, currentCard);
		}
    
    if (data.type === 'submit') {
      console.log('card was submitted');
			console.log($('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')'));
			$('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').attr('type','submitted');	
			console.log($('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')'));
    }
    
    if (data.type === 'back' || data.type === 'discard') {
      $('.board ul:nth-child('+currentRow+') .board-card:nth-child('+currentColumn+')').removeClass('rotated');
      displayCard(currentRow, currentColumn, 'null');
    }
  });
};
