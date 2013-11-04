var Board = require('../server/board');
var Deck = require('../server/deck');
var JobManager = require('../server/job-manager');
var Player = require('../server/player');

var GameManager = function(sockets, name, playerList) {
  var gameRules = require('./decks/standard-rules')[playerList.length - 1];

  this.name = name;
  this.deck = new Deck();
  this.jobManager = new JobManager();
  this.handSize = gameRules.hand;

  this.players = [];
  initializePlayers(this, sockets, playerList);
  this.currentPlayerIndex = 0;  // Player 1 goes first
  
  this.board.reset();
  this.deck.reset();
  this.jobManager.makeJobStack(gameRules.saboteurs, gameRules.miners);
};

// Helper method
var initializePlayers = function(self, sockets, playerList) {
  playerList.forEach(function(playerId, index) {
    if (index === 0) {
      self.board = new Board(sockets.sockets[playerId]);
    } else {
      var player = new Player(sockets.sockets[playerId]);
      self.players.push(player); 
    }
  });
};

// Shuffle all cards
GameManager.prototype.shuffle = function() {
  this.deck.shuffle();
  this.jobManager.shuffle();
};

GameManager.prototype.start = function() {
  // deal jobs, then cards
  var self = this;
  this.players.forEach(function(player) {
    player.setJob(self.jobManager.deal());
    player.addToHand(self.deck.deal(self.handSize));
  })
};

GameManager.prototype.playCard = function(card, data) {
  console.log('game manager has ' + card);
  if (data.type == 'play') {
    return this.board.placeCard(data.y, data.x, card, data.rotated);
  } else if (data.type == 'play-map') {
    console.log('emitting card to the current player: ' + this.getCurrentPlayer().socket.id);
    this.getCurrentPlayer().socket.emit('reveal-goal', {card: card});
    return true;
  } else if (data.type == 'play-action') {
    // TODO Action on Player number
    console.log(data);
    return this.players[data.target].applyCard(card);
  }
  
  return false;
}

GameManager.prototype.eachPlayer = function(callback) {
  var self = this;
  this.players.forEach(function(player, index) {
    callback.call(self, player, index, self);
  });
};

GameManager.prototype.getCurrentPlayer = function() {
  return this.players[this.currentPlayerIndex];
};

GameManager.prototype.startPlayerTurn = function() {
		this.getCurrentPlayer().socket.emit('start turn', "start player turn");
};

GameManager.prototype.nextPlayer = function(){
	this.currentPlayerIndex = this.currentPlayerIndex + 1;
	if (this.currentPlayerIndex === this.players.length) {
		this.currentPlayerIndex = 0;
	}
	this.startPlayerTurn();	
};

module.exports = GameManager;