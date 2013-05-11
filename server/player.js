
var Player = function(socket) {
  this.socket = socket;
  this.job = null;
  this.hand = [];
  this.blocks = {};
};

Player.prototype.setJob = function(job) {
  this.job = job;
};

Player.prototype.addToHand = function(card) {
  this.hand = this.hand.concat(card);
};

Player.prototype.serialize = function() {
  return {
    job: this.job,
    hand: this.hand
  };
};

Player.prototype.applyCard = function(card) {
  var parts = card.split(' ');
  var action = parts.splice(0, 1)[0];

  if (action === 'block') {
  	// TODO validate if possible to free
  	this.blocks[parts.pop()] = true;
  	return true;
  } else if (card.indexOf('free') >= 0) {
  	// TODO validate if blocked
  	this.blocks[parts.pop()] = false;
  	if (parts.length >0) {	// Second part
  		this.blocks[parts.pop()] = false;
  	}
  	return true;
  }
  return false;
};

Player.prototype.isBlocked = function() {
  return this.blocks.pickaxe || this.blocks.light || this.blocks.cart;
};

module.exports = Player;
