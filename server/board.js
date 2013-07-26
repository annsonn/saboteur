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
  if (card.indexOf('rotated-') === 0) {
    return rotateCard(CardRules[card.substr(8)]);
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
  
  if ( this.board[locationY][locationX] ) { // Card already exists
    return false;
  }

  var card = (rotated ? 'rotated-' : '') + card;
  var cardRules = getCardRules(card);

  // validate move

  var isAttached = false;
  // Top
  if (locationY - 1 >= 0 && this.board[locationY - 1][locationX]) {
    isAttached = true;
    var topCardRules = getCardRules(this.board[locationY - 1][locationX]);
    if (topCardRules.bottom && !cardRules.top   // Top card has road but card doesn't connect
        || card.top && !topCardRules.bottom) { // Card has top road, but top card doesn't connect
      return false;
    }
  }

  // Bottom
  if (locationY + 1 < boardHeight && this.board[locationY + 1][locationX]) {
    isAttached = true;
    var bottomCardRules = getCardRules(this.board[locationY + 1][locationX]);
    if (bottomCardRules.top && !cardRules.bottom   // Bottom card has road but card doesn't connect
        || card.bottom && !bottomCardRules.top) { // Card has bottom road, but bottom card doesn't connect
      return false;
    }
  }

  // Left
  if (locationX - 1 >= 0 && this.board[locationY][locationX - 1]) {
    isAttached = true;
    var leftCardRules = getCardRules(this.board[locationY][locationX - 1]);
    if (leftCardRules.right && !cardRules.left   // Left card has road but card doesn't connect
        || card.left && !leftCardRules.right) { // Card has left road, but left card doesn't connect
      return false;
    }
  }

  // Right
  if (locationX + 1 < boardWidth && this.board[locationY][locationX + 1]) {
    isAttached = true;
    var rightCardRules = getCardRules(this.board[locationY][locationX + 1]);
    if (rightCardRules.left && !cardRules.right   // Right card has road but card doesn't connect
        || card.right && !leftCardRules.left) { // Card has right road, but right card doesn't connect
      return false;
    }
  }

  // All good
  this.board[locationY][locationX] = card;

  return true;
};

Board.prototype.removeCard = function( locationX, locationY ) {
  if ( !this.board[locationY][locationX] ) {
    this.board[locationY][locationX] = null;
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