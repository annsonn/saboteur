var JobManager = function() {
  this.numSaboteurs;  
  this.numMiners;
  this.jobs = [];
};

JobManager.prototype.getNumJobs = function(numPlayers) {
  var jobRules = require('./decks/standard-jobs');
  this.numSaboteurs = jobRules[numPlayers][0];
  this.numMiners = jobRules[numPlayers][1];
};

JobManager.prototype.makeJobStack = function(){
  for (var i = 0; i < this.numSaboteurs; i++) {
    this.jobs = this.jobs.concat('saboteur');
  }
  
  for (var i = 0; i < this.numMiners; i++) {
    this.jobs = this.jobs.concat('gold-digger');
  }
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
JobManager.prototype.shuffle = function() {
  for(var j, x, i = this.jobs.length; i; j = parseInt(Math.random() * i), x = this.jobs[--i], this.jobs[i] = this.jobs[j], this.jobs[j] = x);
}

module.exports = JobManager;

