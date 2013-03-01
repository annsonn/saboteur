var port = process.env.PORT || 8080;

var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    url = require("url"),
		path = require("path"),
    fs = require('fs');

app.listen(parseInt(port, 10));
io.set('log level', 1);	// Debug

function handler(request, response) {
  var uri = url.parse(request.url).pathname,
      filename = path.join(__dirname, 'client', uri);
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

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}

io.sockets.on('connection', function (socket) {
  /*
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  */
  
  // Send acknoledgement
  // Synchronize state
  
  
});