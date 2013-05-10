var Player = function(id) {
  this.playerId = id;
  this.job = null; 
  this.hand = [];
}

Player.prototype.setJob = function(job) {
  this.job = job;
}


module.exports = Player;