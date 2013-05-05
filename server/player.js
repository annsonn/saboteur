var Player = function() {
  this.job; 
  this.hand = [];
}

Player.prototype.setJob = function(job) {
  this.job = job;
}

Player.prototype.reset = function(job) {
	this.job = null;
  this.hand = [];
}

module.exports = Player;