var BoardManager = require('../server/board');
var Deck = require('../server/deck');
var JobManager = require('../server/job-manager');

var GameManager = function() {
  this.handSize;
  
  this.board = new Board;
  this.deck = new Deck;
  this.jobManager = new JobManager;
  this.players = [];
}

GameManager.prototype.setup = function(numPlayers) {
	var gameRules = require('./decks/standard-rules');
  this.handSize = gameRules[numPlayers].hand;
  
  this.board.reset();
  this.deck.reset();
  this.jobManager.makeJobStack(gameRules[numPlayers].saboteurs, gameRules[numPlayers].miners);
}

GameManager.prototype.shuffle = function() {
  this.deck.shuffle();
  this.jobManager.shuffle();
}

GameManager.prototype.addPlayer = function() {
  
}

module.exports = GameManager;