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
  var parts = card.split('-');
  var action = parts.splice(0, 1)[0];

  console.log('card played: ' + card);
  console.log('action type: ' + action);  
  
  if (action === 'block') {
  	// TODO validate if possible to free
    if (this.blocks[parts.pop()] == true) {
      console.log('player is already blocked with ' + parts.pop());
      return false;
    }
    console.log('player is now blocked');
  	this.blocks[parts.pop()] = true;
  	return true;
  } else if (card.indexOf('free') >= 0) {
  	// TODO validate if blocked
    if (this.blocks[parts.pop()] == false) {
      console.log('player is not blocked with ' + parts.pop());
      return false;
    }
    this.blocks[parts.pop()] = false;
    if (parts.length >0) {	// Second part
      console.log('player got ' + parts.pop() + 'removed from there');
      this.blocks[parts.pop()] = false;
      return true;
    }
  }
  return false;
}

Player.prototype.isBlocked = function() {
  return this.blocks.pickaxe || this.blocks.light || this.blocks.cart;
};

module.exports = Player;
