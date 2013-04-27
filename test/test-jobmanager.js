var JobManager = require('../server/job-manager');
var JobRules = require('../server/decks/standard-jobs');


exports.testGetJobsThreePlayers = function(test) {
  var jobManager = new JobManager();
    
  jobManager.getJobs('3');
  
  test.equals(jobManager.jobs[0], '1');
  test.equals(jobManager.jobs[1], '3');
  test.done();
}

exports.testGetJobsTenPlayers = function(test) {
  var jobManager = new JobManager();
  
  jobManager.getJobs('10');
  
  test.equals(jobManager.jobs[0], '4');
  test.equals(jobManager.jobs[1], '7');
  test.done();
}