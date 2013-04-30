var JobManager = require('../server/job-manager');
var Deck = require('../server/deck');

var Game = function(sockets, host, name) {
  this.sockets = sockets;
  this.host = host;
  this.name = Math.random().toString(20).substr(2, 5);
  this.players = [];
  
  this.jobManager = new JobManager();
  this.deck = new Deck();
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
  
  this.jobManager.setNumJobs(this.players.length);
  this.jobManager.makeJobStack();
  this.jobManager.shuffle();
   
  this.deck.reset();
  this.deck.shuffle();
  
  //NEED TO KNOW HOW MANY CARDS TO DEAL BASED ON NUMBER OF PLAYERS
  
  //reset board
  //shuffle gold
  
  //send board
  
  // FOR EACH PLAYER Send job/hand/board?
  for (var i; i < this.players.length; i++) {
    // is this how you call this???? no idea....
  	//this.sockets.to(this.players[i].playerId).emit('job', jobManager.deal(), deck.deal(handsize));
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
