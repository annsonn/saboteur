
var Player = function(socket) {
  this.socket = socket;
  this.job = null; 
  this.hand = [];
}

Player.prototype.setJob = function(job) {
  this.job = job;
}

Player.prototype.addToHand = function(card) {
  this.hand.push(card);
}

module.exports = Player;
