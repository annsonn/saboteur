var Board = function() {
  this.board = [];
  this.reset();
}

Deck.prototype.reset = function() {
  this.board = [];
}

Deck.protoype.place = function( location, card ) {
}

module.exports = Board;