// Requires 
var log = require('../../simulation/activityLogging');

// Passing time logs to client
exports.timeLog = function(req, res, next){
	var activityLog = [];
	log.loadTimeLog(
		function(activityArray){
			for (var i = 0; i < activityArray.length; i++){
				activityLog[i] = activityArray[i];
			}

			req.logs = JSON.stringify(activityLog);
			return next();
		}
	);
}