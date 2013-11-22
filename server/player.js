var Player = function(socket) {
  this.socket = socket;
  this.job = null;
  this.hand = [];
  this.blocks = {pickaxe: false, lamp: false, cart: false};
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
  
  if (action === 'block') {
    if (this.blocks[parts[0]]) {
      return false;
    }
  	this.blocks[parts[0]] = true;
  	return 'blocked';
  } else if (action === 'free') {
    var freed = false;
    freed = ( freePlayer(this.blocks, parts[0]) || freePlayer(this.blocks, parts[1]) ) ? true : false; 
    return 'freed';
  }
  return false;
}

var freePlayer = function(blocks, actionType){
  if (!actionType) {
    return false;
  }  
  if (!blocks[actionType]) {
    return false;
  }
  blocks[actionType] = false;
  return true;
}

Player.prototype.isBlocked = function() {
  return this.blocks.pickaxe || this.blocks.light || this.blocks.cart;
};

Player.prototype.getBlocks = function() {
  return {pickaxe: this.blocks['pickaxe'], lamp: this.blocks['lamp'], cart: this.blocks['cart']};
};

module.exports = Player;
