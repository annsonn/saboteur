var Board = require('../server/board');

exports.testBoardReset = function(test) {
  var board = new Board();
  
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
