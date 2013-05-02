var Board = function() {
  this.board = []; 
}

Board.prototype.reset = function() {
  this.board = [];
}

Board.prototype.placeCard = function( location, card ) {
}

Board.prototype.removeCard = function( location ) {
}

Board.prototype.flipGold = function ( location ) {  
}

Board.prototype.shuffleGold = function ( location ) {  
}

module.exports = Board;