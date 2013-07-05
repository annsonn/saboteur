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
  this.currentPlayerIndex = 1;  // Player 1 goes first
  
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

GameManager.prototype.playCard = function(card, target) {
  var result = false;
  if (target && target.x && target.y) {
    // TODO Place on board
    result = this.board.placeCard(target.y, target.x, card, target.rotated);
  } else if (!isNaN(parseFloat(target)) && isFinite(target)) {
    // TODO Action on Player number
    result = this.players[target].applyCard(target);
  }
  
  return result;
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

module.exports = GameManager;