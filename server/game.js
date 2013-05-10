var GameManager = require('../server/game-manager');

var Game = function(sockets, host, name) {
  this.sockets = sockets;
  this.host = host;
  this.name = Math.random().toString(20).substr(2, 5);
  this.players = [];

  this.state = 'waiting';

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
  this.sockets.to(this.name).emit('joined', {playerId: socket.id, game: this.serialize()});
};

Game.prototype.start = function(socket) {
  this.state = 'start game';
  this.gameManager = new GameManager(this.sockets, this.players);
  this.gameManager.shuffle();
  this.gameManager.start();
  console.log('game manager is ready');

  this.gameManager.eachPlayer(function(player) {
    console.log('sending to ' + player.socket.id);
    player.socket.emit('start', player.serialize());
  });

  this.gameManager.board.socket.emit('start', this.gameManager.board.serialize());
  
};

Game.prototype.leave = function(socket) {
  if (socket.id === this.host) {
    this.sockets.to(this.name).emit('host left', this.serialize());
  }
  this.players.splice(this.players.indexOf(socket.id), 1)
  this.sockets.to(this.name).emit('left', {playerId: socket.id, game: this.serialize()});
  socket.leave(this.name);
}

exports.Game = Game;
