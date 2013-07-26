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
};

exports.testApplyAndIsBlocked = function(test) {
  var player = new Player();

  test.ok(!player.isBlocked());

  test.ok(player.applyCard('block light'));
  test.ok(player.applyCard('block cart'));
  test.ok(player.isBlocked());
  test.ok(player.blocks.light);
  test.ok(!player.blocks.pickaxe);

  test.ok(player.applyCard('free light'));
  test.ok(player.applyCard('free cart'));
  test.ok(!player.isBlocked());

  test.ok(!player.applyCard('invalid'));
  test.done();
};