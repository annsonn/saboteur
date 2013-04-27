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
  for (var i = 0; i < numSaboteurs; i++) {
    this.job = this.job.push['saboteur'];
  }
  
  for (var i = 0; i < numMiners; i++) {
    this.job = this.job.push['gold-digger'];
  }
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
JobManager.prototype.shuffle = function() {
  for(var j, x, i = this.cards.length; i; j = parseInt(Math.random() * i), x = this.jobs[--i], this.jobs[i] = this.jobs[j], this.jobs[j] = x);
}


module.exports = JobManager;

