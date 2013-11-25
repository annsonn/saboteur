var Deck = require('./deck');
var CardRules = require('./decks/standard-card-rules');
var boardHeight = 7;
var boardWidth = 11;

/* How the grid will work

[0,0][][][][][][][][][][]
[][][][][][][][][][9,1][]
[][][][][][][][][][][]
[][1,3][][][][][][][][9,3][]
[][][][][][][][][][][]
[][][][][][][][][][9,5][]
[][][][][][][][][][][10,6]

*/

// Flip 180 degrees

var Board = function(socket) {
  this.socket = socket;
  this.board = [];
  this.startLocation = {row: 3, column: 1};
  this.goalLocations = [{row: 1, column: 9}, {row: 3, column: 9}, {row: 5, column: 9}];
};

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

Board.prototype.reset = function() {
  var goal = new Deck(['gold', 'coal-left', 'coal-right']);
  goal.shuffle();
  this.initBoard();
  this.board[this.startLocation.row][this.startLocation.column] = 'start';
  for (var i = 0; i < this.goalLocations.length; i++) {
    var card = goal.deal();
    if (card == 'gold') {
      this.gold = {x: this.goalLocations[i].column, y: this.goalLocations[i].row};
    }
    this.board[this.goalLocations[i].row][this.goalLocations[i].column] = card;
  };
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
  // Save gold position
  if (typeof card === 'object') {
    card = card[0];
  }

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

  if (isAttached) {
    // All good
    this.board[locationY][locationX] = card;
    return true;
  }
};

var isRemovable = function ( locationY, locationX, locationSet ) {
	for (var i = 0; i < locationSet.length; i++) {
		if ( locationSet[i].row == locationY && locationSet[i].column == locationX) {
			console.log('cannot remove card');
			return false;
		}
	}
	return true;
};

Board.prototype.removeCard = function( locationY, locationX ) {
	if (isRemovable(locationY, locationX, [this.startLocation]) 
			&& isRemovable(locationY, locationX, this.goalLocations) 
			&& this.board[locationY][locationX]) {		
    this.board[locationY][locationX] = null;
		console.log('removing card from board');
		return true;
  }
	return false;
};

Board.prototype.serialize = function() {
  return this.board;
};

Board.prototype.getNeighbouringCards = function(x, y) {
  var card = getCardRules(this.board[y][x]);
  var result = [];

  if (!card.block) {
    if (card.left && x - 1 >= 0) {
      result.push({x: x - 1, y: y});
    }
    if (card.top && y - 1 >= 0) {
      result.push({x: x, y: y - 1});
    }
    if (card.right && x + 1 < boardWidth) {
      result.push({x: x + 1, y: y});
    }
    if (card.bottom && y + 1 < boardHeight) {
      result.push({x: x, y: y + 1});
    }
  }
  return result;
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
Board.prototype.shuffleGoal = function() {
  for(var j, x, i = this.goal.length; i; j = parseInt(Math.random() * i), x = this.goal[--i], this.goal[i] = this.goal[j], this.goal[j] = x);
};

Board.prototype.hasWinner = function() {
  var self = this;
  var open = [{x: 1, y: 3, score: 0}];
  var closed = [];

  while(open.length > 0) {
    var card = open.pop();

    if (cardEquals(card, this.gold)) {
      return true;
    }

    closed.push(card);

    var neighbours = this.getNeighbouringCards(card.x, card.y);

    neighbours.forEach(function(neighbour) {
      if (!self.board[neighbour.y][neighbour.x]) {
        return;
      }

      var isClosed = !!closed.filter(function(card) {
          return cardEquals(neighbour, card);
      }).length;

      if (isClosed) {
        return; // Exists in closed set (continue)
      }

      neighbour.parent = card;
      neighbour.score = heuristic(neighbour, self.gold);

      pushOrdered(open, neighbour);
    });

  }

  return false;
}

var heuristic = function(start, goal) {
  return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}

var cardEquals = function(start, goal) {
  return start.x === goal.x && start.y === goal.y;
}

var pushOrdered = function(list, card) {
  for (var i = list.length - 1; i >= 0; i--) {
    var theCard = list[i];
    if (theCard.score > card.score) {
      list.splice(i, 0, card);
      return;
    }
  };
  list.push(card);
}

module.exports = Board;