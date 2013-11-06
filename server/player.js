var Player = function(socket) {
  this.socket = socket;
  this.job = null;
  this.hand = [];
  this.blocks = {pickaxe: 'false', lamp: 'false', cart: 'false'};
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
  var actionType = parts.splice(0, 1)[0];

  console.log('card played: ' + card);
  console.log('action type: ' + action + ' -_- ' + actionType);  
  
  if (action === 'block') {
  	// TODO validate if possible to free
    if (this.blocks[actionType] == true) {
      console.log('player is already blocked with ' + actionType);
      return false;
    }
    console.log('player is now blocked with ' + actionType);
  	this.blocks[actionType] = true;
  	return true;
  } else if (card.indexOf('free') >= 0) {
  	// TODO validate if blocked
    if (this.blocks[actionType] == false) {
      console.log('player is not blocked with ' + actionType);
      return false;
    }
    console.log('player is free of ' + actionType);
    this.blocks[actionType] = false;
    
    //TODO: Handle for situtions where you free two types
    
    return true;
  }
  return false;
}

Player.prototype.isBlocked = function() {
  return this.blocks.pickaxe || this.blocks.light || this.blocks.cart;
};

Player.prototype.getBlocks = function() {
  return {pickaxe: this.blocks['pickaxe'], lamp: this.blocks['lamp'], cart: this.blocks['cart']};
};

module.exports = Player;
