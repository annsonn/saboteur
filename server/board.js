var Deck = require('./deck');
var boardHeight = 7;
var boardWidth = 11;

/* How the grid will work

[][][][][][][][][][][10,6]
[][][][][][][][][][9,5][]
[][][][][][][][][][][]
[][1,3][][][][][][][][9,3][]
[][][][][][][][][][][]
[][][][][][][][][][9,1][]
[0,0][][][][][][][][][][]

*/


var Board = function(socket) {
  this.socket = socket;
  this.board = []; 
  
};

Board.prototype.reset = function() {
  var goal = new Deck(['gold', 'coal-left', 'coal-right']);
  goal.shuffle();
  this.initBoard();
  this.placeCard(3, 1, 'start');
  this.placeCard(1, 9, goal.deal());
  this.placeCard(3, 9, goal.deal());
  this.placeCard(5, 9, goal.deal());
};

Board.prototype.initBoard = function() {
  for (var i = 0; i < boardHeight; i++) {
    this.board[i] = [];
    for (var j = 0; j < boardWidth; j++) {
      this.board[i][j] = null;
    }
  }
}

Board.prototype.placeCard = function( locationY, locationX, card ) {
  if ( !this.board[locationY] ) {
    this.board[locationY] = [];
  } 
  
  if ( !this.board[locationY][locationX] ) {
    this.board[locationY][locationX] = card;
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