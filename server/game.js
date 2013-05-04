var GameManager = require('../server/game-manager');

var Game = function(sockets, host, name) {
  this.sockets = sockets;
  this.host = host;
  this.name = Math.random().toString(20).substr(2, 5);
  this.players = [];
  
  this.gameManager = new GameManager();
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
  
	this.gameManager.setup(this.players.length);
	this.gameManager.shuffle();
  console.log('game manager has been setup');
  
  // FOR EACH PLAYER Send job/hand/board?
  for (var i = 0; i < this.players.length; i++) {
    var playerId = this.players[i]
    console.log('sending to ' + playerId);
    if (i === 0){
      // Board
      //this.sockets.sockets[playerId].emit('start', this.gameManager.board.serialize());
      console.log('sent start to board')
      this.sockets.sockets[playerId].emit('start', []);
      // TODO anson do this
    } else {
      // Hand
      console.log('sent start to hand ' + i)
      this.sockets.sockets[playerId].emit('start', {job: 'miner', cards: this.gameManager.deck.deal(2)});
      // TODO anson do this
    }
  }
  
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
