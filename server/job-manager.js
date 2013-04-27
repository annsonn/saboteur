var JobManager = function() {
  this.jobs;  
};

JobManager.prototype.getJobs = function(numPlayers) {
  var jobRules = require('./decks/standard-jobs');
  this.jobs = jobRules[numPlayers];
};




module.exports = JobManager;

