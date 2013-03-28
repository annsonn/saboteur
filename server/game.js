var Game = function(sockets, host, name) {
  this.sockets = sockets;
  this.host = host;
  this.name = name;
  this.players = [];
};

Game.prototype.serialize = function() {
  return {
    name: this.name,
    players: this.players
  };
};

Game.prototype.join = function(socket) {
  socket.join(this.name);
  this.players.push(socket.id);
  socket.to(this.name).emit('joined', {playerId: socket.id, game: this.serialize()});
};

Game.prototype.leave = function(socket) {
  if (socket.id === this.host) {
    socket.to(this.name).emit('host left', this.serialize());
  }
	this.players.splice(this.players.indexOf(socket.id), 1)
  socket.to(this.name).emit('left', {playerId: socket.id, game: this.serialize()});
  socket.leave(this.name);
}

exports.Game = Game;
