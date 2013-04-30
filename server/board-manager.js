var Board = function() {
  this.board = [];
  this.reset();
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


module.exports = Board;