var Board = function() {
  this.board = []; 
  this.goal = ['gold', 'coal', 'coal'];
}

Board.prototype.reset = function() {
  this.board = [];
  this.board.placeCard( 0, 0, 'start' );
	this.board.placeCard( 2, 8, this.board.dealGoal() );
  this.board.placeCard( 0, 8, this.board.dealGoal() );
  this.board.placeCard( -2, 8, this.board.dealGoal() );
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

Board.prototype.dealGoal = function () {  
 return this.goal.splice(0, 1);
}

module.exports = Board;