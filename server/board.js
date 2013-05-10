var Board = function() {
  this.board = []; 
  this.goal = ['gold', 'coal', 'coal'];
}

Board.prototype.reset = function() {
  this.board[0] = [];
  this.board[2] = [];
  this.board[-2] = [];
  
  this.board[0][0] = 'start';
  this.board[0][8] = dealGoal(this.goal);
  this.board[2][8] = dealGoal(this.goal);
  this.board[-2][8] = dealGoal(this.goal);
}

Board.prototype.placeCard = function( locationX, locationY, card ) {
  if ( !this.board[locationX] ) {
    this.board[locationX] = [];
  } 
  
  if ( !this.board[locationX][locationY] ) {
    this.board[locationX][locationY] = card;
  }
}

Board.prototype.removeCard = function( locationX, locationY ) {
  if ( !this.board[locationX][locationY] ) {
    // discard(this.board[locationX][locationY])
    this.board[locationX][locationY] = null;
  }
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
Board.prototype.shuffleGoal = function() {
  for(var j, x, i = this.goal.length; i; j = parseInt(Math.random() * i), x = this.goal[--i], this.goal[i] = this.goal[j], this.goal[j] = x);
}

var dealGoal = function ( goalCards ) {  
	return goalCards.splice(0, 1);
}

module.exports = Board;