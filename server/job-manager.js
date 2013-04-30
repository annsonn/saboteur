var JobManager = function() {
  this.numSaboteurs;  
  this.numMiners;
  this.jobs = [];
};

JobManager.prototype.setNumJobs = function(numPlayers) {
  var jobRules = require('./decks/standard-jobs');
  
  this.numSaboteurs = jobRules[numPlayers].saboteurs;
  this.numMiners = jobRules[numPlayers].miners;
};

JobManager.prototype.makeJobStack = function(saboteurs, miners){
  for (var i = 0; i < saboteurs; i++) {
    this.jobs = this.jobs.concat('saboteur');
  }
  
  for (var i = 0; i < miners; i++) {
    this.jobs = this.jobs.concat('gold-digger');
  }
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
JobManager.prototype.shuffle = function() {
  for(var j, x, i = this.jobs.length; i; j = parseInt(Math.random() * i), x = this.jobs[--i], this.jobs[i] = this.jobs[j], this.jobs[j] = x);
}

JobManager.prototype.deal = function() {
  return this.jobs.splice(0, 1);
}

module.exports = JobManager;

