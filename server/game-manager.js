//var BoardManager = require('../server/board');
var Deck = require('../server/deck');
var JobManager = require('../server/job-manager');

var GameManager = function() {
  this.handSize;
  
  //this.board = new Board;
  this.deck = new Deck;
  this.jobManager = new JobManager;
}

GameManager.prototype.setup = function(numPlayers) {
	var gameRules = require('./decks/standard-rules');
  this.handSize = gameRules[numPlayers].hand;
  
  this.deck.reset();
  this.jobManager.makeJobStack(gameRules[numPlayers].saboteurs, gameRules[numPlayers].miners);
}

GameManager.prototype.shuffle = function() {
  //this.board.shuffleGold();
  this.deck.shuffle();
  this.jobManager.shuffle();
}


module.exports = GameManager;