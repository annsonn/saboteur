// Server module
exports.listen = function() {
    var port = process.env.PORT || 8080;
    
    var app = require('http').createServer(handler),
        io = require('socket.io').listen(app),
        url = require("url"),
        path = require("path"),
        fs = require('fs');
    
    app.listen(parseInt(port, 10));
    io.set('log level', 1);	// Debug
    
    var mime = {
      js: 'text/javascript'
    }
    
    function handler(request, response) {
      var uri = url.parse(request.url).pathname,
          filename = path.join(__dirname, '../client', uri);
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
        });
      });
    }
    
    var games = {};
    io.sockets.on('connection', function (socket) {
      
      socket.send('Who are you?');
      console.log('Unknown connection');
    
      socket.on('handshake', function (data) {
        socket.set('type', data, function() {
          console.log('A ' + data + ' connected.');
        });
      });
      
      socket.on('create', function() {
        socket.get('type', function(err, type) {
          if (type == 'view') {
            var gameId = Math.random().toString(20).substr(2, 5);
            socket.set('game', gameId, function() {
              socket.emit('joined', gameId);
              console.log('Creating game ' + gameId);
    
              // TODO Create new game
              games[gameId] = {socket: [socket]};
            });
          } else {
            console.log('Only views can create games');
          }
        });
      });
      
      socket.on('join', function(id) {
        if (games[id] && games[id].sockets.length < 12) {
          console.log('Device joined ' + id);
        }
      });
      
      socket.on('message', function(data) {
        console.log('Message: ' + data);
        socket.broadcast.emit('message', data);
      });
      
      socket.on('disconnect', function() {
        // TODO if game create, destroy game
      });
    
    
      // Send acknoledgement
      // Synchronize state
      
    });
};

