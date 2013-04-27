var JobManager = require('../server/job-manager');
var JobRules = require('../server/decks/standard-jobs');


exports.testGetJobsThreePlayers = function(test) {
  var jobManager = new JobManager();
    
  jobManager.getNumJobs('3');
  
  test.equals(jobManager.numSaboteurs, '1');
  test.equals(jobManager.numMiners, '3');
  test.done();
}

exports.testGetJobsTenPlayers = function(test) {
  var jobManager = new JobManager();
  
  jobManager.getNumJobs('10');
  
  test.equals(jobManager.numSaboteurs, '4');
  test.equals(jobManager.numMiners, '7');
  test.done();
}