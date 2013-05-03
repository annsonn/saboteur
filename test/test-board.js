var Board = require('../server/board');

exports.testBoardReset = function(test) {
  var board = new Board();
  
  board.reset();
  
  test.equal(board.board[0].length, 9);
  test.equal(board.board[2].length, 9);
  test.equal(board.board[-2].length, 9);
  test.done();
}
