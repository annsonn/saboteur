var Deck = function() {
	this.cards = [];
  
  this.reset();
  this.shuffle();
};

/**
 * Reset cards in deck
 */
Deck.prototype.reset = function() {
  this.cards = require('./decks/standard');
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
Deck.prototye.shuffle = function() {
	for(var j, x, i = this.cards.length; i; j = parseInt(Math.random() * i), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x);
}

modules.exports = Deck;
