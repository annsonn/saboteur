var Player = require('../server/player');

exports.testSetJob = function(test) {
  var player = new Player();
  
  player.setJob('saboteur');
  
  test.equal(player.job, 'saboteur');
  test.done();
}

exports.testReset = function(test) {
  var player = new Player();
  
  player.setJob('saboteur');
  
  player.reset();
  
  test.equal(player.job, null);
  test.done();
}
