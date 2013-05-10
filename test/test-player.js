var Player = require('../server/player');

exports.testCreate = function(test) {
    var player = new Player('socket');

    test.equal(player.socket, 'socket');

    test.done();
}

exports.testSetJob = function(test) {
  var player = new Player();
  
  player.setJob('saboteur');
  
  test.equal(player.job, 'saboteur');
  test.done();
}

exports.testAddToHand = function(test) {
    var player = new Player();

    player.addToHand('card');
    player.addToHand(['one', 'two']);

    test.deepEqual(player.hand, ['card', 'one', 'two']);

    test.done();
}