var GameManager = require('../server/game-manager');

var makeFixture = function(playerList) {
  return {
    sockets: {sockets: playerList.reduce(function(hash, player) {hash[player] = player; return hash;}, {})},
    players: playerList
  };
};

var fixtureThreePlayers = makeFixture(['host', 'one', 'two', 'three']);
var fixtureTenPlayers = makeFixture(['host', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);

exports.testMakeFixture = function(test) {
  var fixture = makeFixture(['one']);
  test.equal(fixture.sockets.sockets.one, 'one');
  test.equal(fixture.players[0], 'one');
  test.done();
};

exports.testCreate = function(test) {
  var gameManager = new GameManager(fixtureThreePlayers.sockets, 'name', fixtureThreePlayers.players);
  
  test.ok(gameManager);
  test.equal(gameManager.handSize, 6);
  test.equal(gameManager.jobManager.jobs.length, 4);
  test.equal(gameManager.players.length, 3);
  test.equal(gameManager.board.socket, 'host');
  
  test.done();
};

exports.testShuffle = function(test) {
  var gameManager = new GameManager(fixtureTenPlayers.sockets, 'name', fixtureTenPlayers.players);
  
  var jobstack = gameManager.jobManager.jobs.slice(0);
  var deck = gameManager.deck.cards.slice(0);
  
  gameManager.shuffle();
  
  test.equal(gameManager.handSize, 4);
  test.equal(gameManager.jobManager.jobs.length, 11);
  test.notDeepEqual(gameManager.deck.cards, deck);
  test.notDeepEqual(gameManager.jobManager.jobs, jobstack);

  test.done();
};

exports.testStart = function(test) {
  var gameManager = new GameManager(fixtureThreePlayers.sockets, 'name', fixtureThreePlayers.players);
  
  var jobStack = gameManager.jobManager.jobs.slice(0);

  gameManager.start();
  gameManager.eachPlayer(function(player) {
    test.ok(player.job);
    test.equal(player.hand.length, gameManager.handSize);
    test.equal(player.job, jobStack.splice(0, 1)[0]);
  });
  
  test.done();
}