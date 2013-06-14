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
      
      app.listen(parseInt(port, 10));
      io.set('log level', 1);	// Debug
      
      io.sockets.on('connection', function (socket) {
        socket.emit('identity', socket.id);
        console.log('Connection established with ' + socket.id);
        
        socket.on('create', self.handlers.createGame(socket));
        socket.on('join', self.handlers.joinGame(socket));
        socket.on('leave', self.handlers.leaveGame(socket));
        socket.on('start', self.handlers.startGame(socket));
        
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
      createGame: function(socket, callback) {
        return function() {
          (self.handlers.leaveGame(socket, function() {
            var game = new Game(self.io.sockets, socket.id);
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
        var url = require("url"),
            path = require("path"),
            fs = require('fs');
        var uri = url.parse(request.url).pathname,
            filename = path.join(__dirname, '../client', uri);
        var mime = {
          js: 'text/javascript',
          css: 'text/css'
        };
        fs.exists(filename, function(exists) {
          if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
          }
        
          if (fs.statSync(filename).isDirectory()) filename += '/index.html';
        
          fs.readFile(filename, "binary", function(err, file) {
            if(err) {
              response.writeHead(500, {"Content-Type": "text/plain"});
              response.write(err + "\n");
              response.end();
              return;
            }
  
            // TODO need MIME type mappings
            var changedMimeType = false;
            for (var type in mime) {
              if (filename.match(type + '$') == type) {
                response.writeHead(200, {'Content-Type': mime[type]});
                changedMimeType = true;
                break;
              }
            }
            if (!changedMimeType) {
              response.writeHead(200);
            }
            response.write(file, "binary");
            response.end();
          }); // fs.readFile
        }); // fs.exists
      } // httpRequest
    } // Handlers
  };
  return self;
};

module.exports = Server;
