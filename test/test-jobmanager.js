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

exports.testMakeJobStackFivePlayers = function(test) {
  var jobManager = new JobManager();
  
  jobManager.numSaboteurs = '2';
  jobManager.numMiners = '4';
  
	jobManager.makeJobStack();
  
  test.equals(jobManager.jobs.length, '6');
  test.done();
}

exports.testJobShuffle = function(test) {
  var jobManager = new JobManager();
  
  jobManager.numSaboteurs = '3';
  jobManager.numMiners = '5';
  
  jobManager.makeJobStack();
  var originJobStack = jobManager.jobs.slice(0);
  
  jobManager.shuffle();
  
  test.equals(originJobStack.length, jobManager.jobs.length);  
  test.notDeepEqual(jobManager.jobs, originJobStack);
  
  test.done();
}