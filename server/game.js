var Game = function(sockets, host, name) {
  this.socket = sockets;
  this.host = host;
  this.name = name;
  this.playerCount = 0;
};

Game.prototype.serialize = function() {
  return {
    name: this.name
  };
};

Game.prototype.join = function(socket) {
  socket.join(this.name);
  this.playerCount++;
  socket.to(this.name).emit('joined', {player: socket.id, game: this.serialize()});
};

Game.prototype.leave = function(socket) {
  if (socket.id === this.host) {
    socket.to(this.name).emit('host left', this.serialize());
  }

  this.playerCount--;
  socket.to(this.name).emit('left', {player: socket.id, game: this.serialize()});
  socket.leave(this.name);
}

exports.Game = Game;
