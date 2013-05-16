var Deck = require('./deck');

var Board = function(socket) {
  this.socket = socket;
  this.board = []; 
};

Board.prototype.reset = function() {
  var goal = new Deck(['gold', 'coal-left', 'coal-right']);
  goal.shuffle();
  this.placeCard(0, 0, 'start');
  this.placeCard(0, 8, goal.deal());
  this.placeCard(2, 8, goal.deal());
  this.placeCard(-2, 8, goal.deal());
};

Board.prototype.placeCard = function( locationX, locationY, card ) {
  if ( !this.board[locationX] ) {
    this.board[locationX] = [];
  } 
  
  if ( !this.board[locationX][locationY] ) {
    this.board[locationX][locationY] = card;
  }
};

Board.prototype.removeCard = function( locationX, locationY ) {
  if ( !this.board[locationX][locationY] ) {
    // discard(this.board[locationX][locationY])
    this.board[locationX][locationY] = null;
  }
};

Board.prototype.serialize = function() {
  return this.board;
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
Board.prototype.shuffleGoal = function() {
  for(var j, x, i = this.goal.length; i; j = parseInt(Math.random() * i), x = this.goal[--i], this.goal[i] = this.goal[j], this.goal[j] = x);
};


module.exports = Board;