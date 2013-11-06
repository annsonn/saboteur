var Names = require('./names');
var GameManager = require('./game-manager');

var Game = function(sockets, hostSocket) {
  this.sockets = sockets;
  this.host = hostSocket;
  //this.name = Math.random().toString(20).substr(2, 5);
  var rand1 = Math.floor(Math.random() * Names.colors.length);
  //var rand2 = Math.floor(Math.random() * Names.adjectives.length);
  //var rand3 = Math.floor(Math.random() * Names.nouns.length);
  //this.name = Names.adjectives[rand2] + ' ' + Names.colors[rand1] + ' ' + Names.nouns[rand3];
  this.name = Names.adjectives[rand1];
  this.players = [];
  this.playerLimit = 10;
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
  this.gameManager = new GameManager(this.sockets, this.name, this.players);
  this.gameManager.shuffle();
  this.gameManager.start();
  console.log('game manager is ready');

  this.gameManager.eachPlayer(function(player) {
    console.log('sending to ' + player.socket.id);
    player.socket.emit('start', player.serialize());
  });

  this.gameManager.board.socket.emit('start', this.gameManager.board.serialize());
	this.gameManager.startPlayerTurn();
};

Game.prototype.play = function(socket, card, data) {
  //TODO: more logic to handle when you play action cards on people
  var playCard = this.gameManager.playCard(card, data);
  console.log('Done Play Card Returned: ' + playCard);
  if (playCard == false) {
    socket.emit('place card');
    this.gameManager.getCurrentPlayer().socket.emit('deal', {card: this.gameManager.deck.deal()});
    this.sockets.to(this.name).emit('next player', this.gameManager.getCurrentPlayer().socket.id);
		this.gameManager.nextPlayer();
  } else {
    socket.emit('error', data);
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
