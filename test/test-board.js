var Board = require('../server/board');

exports.testBoardReset = function(test) {
  var board = new Board('socket');

  var height = 7;
  var width = 11;

  board.reset();

  for (var i = 0; i < height; i++) {
    test.equal(board.board[i].length, width);
  }

  test.equal(board.board[3][1], 'start');
  test.notEqual(board.board[1][9], null);
  test.notEqual(board.board[3][9], null);
  test.notEqual(board.board[5][9], null);

  test.done();
}

exports.testPlaceCardPass = function(test) {
  var board = new Board('socket');

  var locationY = 3;
  var locationX = 2;
  var card = 'connected-top-right-left';
  var rotated = false;

  board.reset();

  test.equal(board.placeCard(locationY, locationX, card, rotated), true);
  test.done();
}

exports.testPlaceCardFail = function(test) {
  var board = new Board('socket');

  var card = 'deadend-top';

  board.reset();

  test.equal(board.placeCard(3, 2, card, false), false);
  test.equal(board.placeCard(3, 0, card, false), false);
  test.equal(board.placeCard(2, 1, card, false), false);
  test.equal(board.placeCard(4, 1, card, false), true);
  test.equal(board.placeCard(4, 1, card, true), false);
  test.done();
}

exports.testWinner = function(test) {
  var board = new Board('socket');

  board.reset();

  // Place a card in a snake pattern
  //    0  1  2  3  4  5  6  7  8  9  10
  // 0 [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
  // 1 [ ][,][-][.][ ][ ][ ][.][-][?][ ]
  // 2 [ ][|][ ][|][ ][ ][ ][|][ ][ ][ ]
  // 3 [ ][S][ ][|][ ][,][-][+][-][?][ ]
  // 4 [ ][ ][ ][|][ ][|][ ][|][ ][ ][ ]
  // 5 [ ][ ][ ][`][-][.][ ][`][-][?][ ]
  // 6 [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]

  // Position road to (3, 7)
  test.equal(board.placeCard(2, 1, 'connected-top-bottom', false), true);
  test.equal(board.placeCard(1, 1, 'connected-top-left', true), true);
  test.equal(board.placeCard(1, 2, 'connected-right-left', false), true);
  test.equal(board.placeCard(1, 3, 'connected-top-right', true), true);
  test.equal(board.placeCard(2, 3, 'connected-top-bottom', false), true);
  test.equal(board.placeCard(3, 3, 'connected-top-bottom', false), true);
  test.equal(board.placeCard(4, 3, 'connected-top-bottom', false), true);
  test.equal(board.placeCard(5, 3, 'connected-top-right', false), true);
  test.equal(board.placeCard(5, 4, 'connected-right-left', false), true);
  test.equal(board.placeCard(5, 5, 'connected-top-left', false), true);
  test.equal(board.placeCard(4, 5, 'connected-top-bottom', false), true);
  test.equal(board.placeCard(3, 5, 'connected-top-left', true), true);
  test.equal(board.placeCard(3, 6, 'connected-right-left', false), true);
  test.equal(board.placeCard(3, 7, 'connected-cross', false), true);

  // Should not be a winner
  test.equal(board.hasWinner(), false);

  // Make path to winner (upper card)
  test.equal(board.placeCard(2, 7, 'connected-top-bottom', false), true);
  test.equal(board.placeCard(1, 7, 'connected-top-left', true), true);
  test.equal(board.placeCard(1, 8, 'connected-right-left', false), true);

  // Make path to winner (middle card)
  test.equal(board.placeCard(3, 8, 'connected-right-left', false), true);

  // Make path to winner (lower card)
  test.equal(board.placeCard(4, 7, 'connected-top-bottom', false), true);
  test.equal(board.placeCard(5, 7, 'connected-top-right', false), true);
  test.equal(board.placeCard(5, 8, 'connected-right-left', false), true);


  test.equal(board.hasWinner(), true);

  test.done();
}

