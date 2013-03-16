// Server module
var Server = function() {
  var self = {
    games: {},

    listen: function() {
      console.log(self);
      console.log('Creating server...');
      var port = process.env.PORT || 8080;
      
      var app = require('http').createServer(self._handler),
          io = require('socket.io').listen(app);
      
      app.listen(parseInt(port, 10));
      io.set('log level', 1);	// Debug
      
      io.sockets.on('connection', function (socket) {
        socket.send('Who are you?');
        console.log('Unknown connection');
        
        socket.on('identity', function (data) {
          // {name, type}
          socket.set('identity', data, function() {
            console.log(data.name + ' connected.');
          });
        });
        
        socket.on('create', function() {
          var gameId = Math.random().toString(20).substr(2, 5);
          socket.set('game', gameId, function() {
            socket.emit('joined', gameId);
            console.log('Creating game ' + gameId);
            
            // TODO Create new game
            games[gameId] = {host: socket.id, name: gameId};
            socket.join(gameId);
          });
        });
        
        socket.on('join', function(id) {
          // TODO check if already in game
          socket.set('game', id, function() {
          	socket.join(id);    
            console.log('Device joined ' + id);
          });
        });
        
        socket.on('leave', function() {
          // TODO check if in game
          socket.get('game', function(gameId) {
            socket.set('game', null, function() {
              socket.leave(gameId); 
              console.log('Device left ' + gameId);
            });
          });
        });
        
        socket.on('message', function(message) {
          socket.get('game', function(gameId) {
            if (gameId) {
              console.log('[' + gameId + '] Message: ' + message);
              socket.to(gameId).send(message);
            } else {
              console.log('Message: ' + message);
              socket.broadcast.send(message);	// TODO remove this
            }
          });
        });
        
        socket.on('disconnect', function() {
          socket.get('game', function(id) {
            if (games[id].host === socket.id) {
              // TODO destroy game
            } else {
            }
          });
        });
      
      
        // Send acknoledgement
        // Synchronize state
        
      });
    },
    
    _handler: function (request, response) {
      var url = require("url"),
          path = require("path"),
          fs = require('fs');
      var uri = url.parse(request.url).pathname,
          filename = path.join(__dirname, '../client', uri);
      var mime = {
        js: 'text/javascript'
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
    }
  };
  return self;
};

exports.createServer = function() {
  return new Server();
};