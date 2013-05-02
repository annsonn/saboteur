var JobManager = require('../server/job-manager');

exports.testMakeJobStackFivePlayers = function(test) {
  var jobManager = new JobManager();
  
	jobManager.makeJobStack(2, 4);
  
  test.equals(jobManager.jobs.length, '6');
  test.done();
}

exports.testJobShuffle = function(test) {
  var jobManager = new JobManager();
  
  jobManager.makeJobStack(3, 5);
  var originJobStack = jobManager.jobs.slice(0);
  
  jobManager.shuffle();
  
  test.equals(originJobStack.length, jobManager.jobs.length);  
  test.notDeepEqual(jobManager.jobs, originJobStack);
  
  test.done();
}

exports.testJobDeal = function(test) {
	var jobManager = new JobManager();
 	
  jobManager.makeJobStack(1, 3);
 	var originJobStack = jobManager.jobs.slice(0);
  
  for (var i; i < jobManager.jobs.length; i++) {
  	 test.equals(jobManager.deal(), originJobStack.splice(0, 1));
  }
    
	test.done(); 
}