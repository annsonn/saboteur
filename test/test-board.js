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

  // TODO place cards to win the game on wherever the gold is

  // TODO check winner
  test.equal(board.hasWinner(), false);

  test.done();
}

