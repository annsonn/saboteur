var GameManager = require('../server/game-manager');

exports.testGameManagerSetup = function(test) {
  var gameManager = new GameManager();
  
  gameManager.setup(3);
  
  test.equal(gameManager.handSize, 6);
  test.equal(gameManager.jobManager.jobs.length, 4)
  
  test.done();
}


exports.testGameManagerShuffle = function(test) {
  var gameManager = new GameManager;
  
  gameManager.setup(10);
  
  var jobstack = gameManager.jobManager.jobs.slice(0);
  var deck = gameManager.deck.cards.slice(0);
  
  gameManager.shuffle();
  
  test.equal(gameManager.handSize, 4);
  test.equal(gameManager.jobManager.jobs.length, 11)
  test.notDeepEqual(gameManager.deck.cards, deck);
  test.notDeepEqual(gameManager.jobManager.jobs, jobstack);

  test.done();
}

exports.testGameManagerAddPlayer = function(test) {
  var gameManager = new GameManager;
  
  gameManager.addPlayer('testId');
  
  test.equal(gameManager.players.length, 1);
  test.done();
  
}