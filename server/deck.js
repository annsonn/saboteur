var Deck = function() {
  this.cards = [];
  
  this.reset();
  this.shuffle();
};

/**
 * Reset cards in deck and shuffles
 */
Deck.prototype.reset = function() {
  var standardCards = require('./decks/standard');
  this.cards = standardCards.slice(0);
  this.shuffle();
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
Deck.prototype.shuffle = function() {
  for(var j, x, i = this.cards.length; i; j = parseInt(Math.random() * i), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x);
}

Deck.prototype.deal = function(howMany) {
  var howMany = howMany || 1;

  return this.cards.splice(0, howMany);
}

module.exports = Deck;
