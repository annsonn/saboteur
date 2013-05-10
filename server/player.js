
var Player = function(socket) {
  this.socket = socket;
  this.job = null;
  this.hand = [];
}

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

module.exports = Player;
