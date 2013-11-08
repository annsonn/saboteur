var static = require('node-static');
var Game = require('./game').Game;

// Server module
var Server = function() {
  var self = {
    games: {},
    
    listen: function() {
      //console.log('Creating server...');
      var port = process.env.PORT || 8080;
      
      var app = require('http').createServer(self.handlers.httpRequest),
          io = require('socket.io').listen(app);
      self.io = io;
      self.fileServer = new static.Server('./client');
      self.commonFileServer = new static.Server('./common');
      
      app.listen(parseInt(port, 10));
      io.set('log level', 1);	// Debug
      
      io.sockets.on('connection', function (socket) {
        socket.emit('identity', socket.id);
        console.log('Connection established with ' + socket.id);
        
        socket.on('create', self.handlers.createGame(socket));
        socket.on('join', self.handlers.joinGame(socket));
        socket.on('leave', self.handlers.leaveGame(socket));
        socket.on('start', self.handlers.startGame(socket));
        socket.on('board-action', self.handlers.boardAction(socket));
        socket.on('card-action', self.handlers.cardAction(socket));
        socket.on('player-action', self.handlers.playerAction(socket));
        
        socket.on('message', function(message) {
          socket.get('game', function(x, gameId) {
            if (gameId) {
              console.log('[' + gameId + '] Message: ' + message);
              socket.to(gameId).send(message);
            } else {
              console.log('Message: ' + message);
              //socket.broadcast.send(message);	// TODO remove this
            }
          });
        });
        
        socket.on('disconnect', self.handlers.disconnect(socket));
      
      });
    },
    
    handlers: {

      boardAction: function(socket) {
        return function(data) {
          socket.get('game', function(x, gameId) {
            var game = self.games[gameId];
            console.log(data);
            
            if (game) {
              if (data.type === 'play') {
                // place card on the board if not valid then tell board to blink red
                 game.play(socket, data.card, {type: data.type, x: data.position.column, y: data.position.row, rotated: data.position.rotated});
              }
              if (data.type === 'play-action') {
                // TODO: get board to send the target player's number
                game.play(socket, data.card, {type: data.type, target: data.target});
              }
							if (data.type === 'play-map') {
								// send current player the selected card
                game.play(socket, data.card, {type: data.type});
							}
            }
          });
        };
      },
      
      cardAction: function(socket, callback) {
        return function(data) {
          socket.get('game', function(x, gameId) {
            var game = self.games[gameId];
            if (game) {  
              // sending to host
              game.host.emit('card-action', {type: data.type, cardType: data.cardType});
            }
          });
        }
      },
      
      playerAction: function(socket, callback) {
        return function(data) {
          socket.get('game', function(x, gameId) {
            var game = self.games[gameId];
            if (game) {  
							console.log('SERVER.JS - ' + data);
              // sending to host
              if (data.type == 'preview'){
                if (data.cardType == 'path'){
                  game.host.emit('player-action', {card: data.card, type: data.type});
                } 
                if (data.cardType == 'action') {
                  // get all the players and their blocks on them and display them on the board
                  // for each player emit their block cards to the board, then tell the board to update the view with the selected card.
                  console.log('SERVER.JS - Emitting player block cards');
                  for (var i=0; i < game.gameManager.players.length; i++) {
                    game.host.emit('player-block-status', {playerNumber: i, isBlocked: game.gameManager.players[i].isBlocked(), blocks: game.gameManager.players[i].getBlocks()});
                  }
                  game.host.emit('player-action-card', {card: data.card, currentPlayer: game.gameManager.currentPlayerIndex});
                }
								if (data.cardType == 'map') {
									console.log('SERVER.JS - Player played a map card');
									// send server goal positions that are not flipped
									// emit coordinates of goals to board in array
									game.host.emit('map-card', game.gameManager.board.goalLocations);
								}
              }
                
              if (data.type == 'back') {
                game.host.emit('player-action', {type: data.type, cardType: data.cardType});
              }
              
							// if is submitted, then trigger turn ending event (deal new card and move to next player)
							if (data.type == 'submit') {
                game.host.emit('player-action', {type: data.type, cardType: data.cardType});
							};
              
              if (data.type == 'discard') {
                game.gameManager.nextPlayer();
                socket.emit('deal', {card: game.gameManager.deck.deal()});
              }
            }
          });
        }
      },
      
      createGame: function(socket, callback) {
        return function() {
          (self.handlers.leaveGame(socket, function() {
            var game = new Game(self.io.sockets, socket);
            socket.set('game', game.name, function() {
              self.games[game.name] = game;
              console.log('Device created game ' + game.name);
              game.join(socket);
              
              if (callback) callback.call(self);
            });
          }))();
        }
      },
      
      joinGame: function(socket, callback) {
        return function(id) {
          id = id.trim().toLowerCase();
          var game = self.games[id];
          if (!game) {
            console.log('Device tried to join non-existing game ' + id);
            socket.emit('error', {code: 404, message: 'Failed to join game ' + id});
            return;
          } else if (game.players[game.playerLimit]) {
            console.log('Device attempted to join but game is full ' + id);
            socket.emit('game-full', 'Game is Full');
            socket.emit('error', {code: 404, message: 'Failed to join game ' + id});
          } else {
            (self.handlers.leaveGame(socket, function() {
              socket.set('game', id, function() {
                game.join(socket);
                if (callback) callback.call(self);
              });
            }))();	// Call leave game
          }
        }
      },
      
      startGame: function(socket, callback) {
        return function(id) {          
          socket.get('game', function(x, gameId) {
            var game = self.games[gameId];
            if (game) {  
              game.start(socket);
              console.log('Game ' + gameId + ' has started');
            } else {
              console.log('Device tried to start non-existing game ' + id);
              socket.emit('error', {code: 404, message: 'Failed to join game ' + id});
            }
            if (callback) callback.call(self);
          });
        }
      }, 
      
      leaveGame: function(socket, callback) {
        return function() {
          // TODO check if in game
          socket.get('game', function(x, gameId) {
            if (gameId) {
              socket.set('game', null, function() {
	              var game = self.games[gameId];
                if (game) {
                  game.leave(socket); 
                  console.log('Device left game ' + gameId);
                  
                  if (game.players.length === 0) {
                    delete self.games[gameId];
                  }
                }
              });
            }
            if (callback) callback.call(self);
          });
        }
      },
      
      disconnect: function(socket) {
        return function() {
          socket.get('game', function(x, gameId) {
            if (gameId) {
              self.games[gameId].leave(socket);
		          console.log('client in game ' + gameId + ' disconnected ' + socket.id);
            } else {
		          console.log('client disconnected ' + socket.id);
            }
          });
        };
      },
      
      httpRequest: function (request, response) {
        if (request.url.search(/\/common\/.+/) === 0) {
          request.url = request.url.replace(/\/common/, '');
          self.commonFileServer.serve(request, response);
        } else {
          self.fileServer.serve(request, response);
        }
      } // httpRequest
    } // Handlers
  };
  return self;
};

module.exports = Server;
