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
            if (game) {
              if (data.type === 'play') {
                game.play(socket, data.card, {x: data.position.column, y: data.position.row, rotated: data.position.rotated});
              }
            }
          });
        };
      },
      
      cardAction: function(socket, callback) {
        return function(data) {
          console.log(data);
          socket.get('game', function(x, gameId) {
            var game = self.games[gameId];
            if (game) {  
              // sending to host
              game.host.emit('card-action', {type: data.type});
            }
          });
        }
      },
      
      playerAction: function(socket, callback) {
        return function(data) {
          console.log(data);
          socket.get('game', function(x, gameId) {
            var game = self.games[gameId];
            if (game) {  
              // sending to host
							if (data.cardType == 'map'){
								game.host.emit('player-action', {card: data.card, type: data.type});
							} else if (data.cardType == 'action') {
								// get all the players and their blocks on them and display them on the board
								// for each player emit their block cards to the board, then tell the board to update the view with the selected card.
								
								
								
								
								game.host.emit('player-action-card', {card: data.card, currentPlayer: socket, allPlayerBlock:});
							}
           
							// if is submitted, then trigger turn ending event (deal new card and move to next player)
							if (data.type == 'submit' || data.type == 'discard') {
								socket.emit('deal', {card: game.gameManager.deck.deal()});
								//TODO manage discard deck
							};
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
