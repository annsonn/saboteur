//var BoardManager = require('../server/board-manager');
var Deck = require('../server/deck');
var JobManager = require('../server/job-manager');

var GameManager = function() {
  this.handSize;
  
  //this.board = new Board;
  this.deck = new Deck;
  this.jobManager = new JobManager;
}

GameManager.prototype.setupGame = function(numPlayers) {
	var gameRules = require('./decks/standard-rules');
  this.handSize = gameRules[numPlayers].hand;
  this.jobManager.makeJobStack(gameRules[numPlayers].saboteurs, gameRules[numPlayers].miners);
}

GameManager.prototype.shuffleDecks = function() {
  //this.board.shuffleGold();
  this.deck.shuffleDeck();
  this.jobManager.shuffleJobs();
}


module.exports = GameManager;