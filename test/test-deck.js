var Deck = require('../server/deck');
var StandardDeck = require('../server/decks/standard');

exports.testDeckShuffle = function(test) {
  var deck = new Deck();
  test.equal(deck.cards.length, StandardDeck.length);

  var cards1 = deck.cards.slice(0);
  deck.shuffle();
  
  test.notDeepEqual(deck.cards, cards1);
  test.equal(deck.cards.length, cards1.length);
  
  test.done();
}

exports.testDeckDeal = function(test) {
	var deck = new Deck();
  test.equal(deck.cards.length, StandardDeck.length);
  
	var cards2 = deck.cards.slice(0);
  var dealt = deck.deal(20);
  
  test.equal(deck.cards.length, cards2.length - 20);
  
  test.done();
}
  
exports.testDeckReset = function(test) {  
	var deck = new Deck();
  test.equal(deck.cards.length, StandardDeck.length);
  
  var cards3 = deck.cards.slice(0);
  deck.reset();
  
  test.equal(deck.cards.length, StandardDeck.length);
  
  test.done();
}