var Deck = require('./deck');
var CardRules = require('./decks/standard-card-rules');
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

// Flip 180 degrees
var rotateCard = function(rules) {
  return {
    top: !!rules.bottom,
    bottom: !!rules.top,
    left: !!rules.right,
    right: !!rules.left,
  }
};

var getCardRules = function(card) {
  if (card.indexOf('rotate-') === 0) {
    return rotateCard(CardRules[card.substr(7)]);
  }
  return CardRules[card];
};

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

Board.prototype.placeCard = function( locationY, locationX, card, rotated ) {
  if ( !this.board[locationY] ) {
    this.board[locationY] = [];
  } 
  
  if ( !this.board[locationY][locationX] ) {
    // validate move
    var card = (rotated ? 'rotated-' : '') + card;
    this.board[locationY][locationX] = card;
    console.log(card + ' placed (): ' + locationX + ', ' + locationY);

    return true;
  }
  return false;
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