/*
var activityCollection;

var connection = require('../connection');
connection(function(db){
	activityCollection = db.collection('activityCollection', function(err, collection) {});
});
*/

var mongoUtil = require( '../mongoUtil' );


// function that takes in current time, and a string that explains the activity
// also inserts the activity into a database collection
exports.addTimeLog = function(activity){
	var db = mongoUtil.getDb();
	var date = new Date();
	var time = date.getTime();

	var activityString = date + ": " + activity;

	// Inserts a time log into our database
	db.collection('activityCollection').insert({activity: activityString},
		function (err, result) {
			if (err) {throw err;}
			//console.log(result);
		}
	);
}

// function for finding all the activity logs in the collection
// also used in the route for passing the list of activitys to the front end
exports.loadTimeLog = function(callback){
	var db = mongoUtil.getDb();
	var array = db.collection('activityCollection').find();
	var index = 0;
		array.toArray(function(err, documents){
			var ret = [];
			for (var i =0; i < documents.length; i++){
				var temp = documents[i].activity;
				ret[index] = temp;
				index++;
			}
			callback(ret);
		});
}

var Action =function(name, time, agent1, agent2){
	this.name = name;
	var date = new Date();
	this.time=date.getTime();
	this.agent1 = agent1;
	this.agent2 = agent2;
}

var ActionHistory = function(){
	this.actions = [];
	
	this.pushAction = function(action){
		this.actions.push(action);
	};
	
	this.popAction = function(){
		return this.actions.pop();
	}
	this.revert =function(network){
		
	};
};
var actionHistory = new ActionHistory();

module.exports.dropLogs = function(callback) {
	activityCollection.drop(function(err, reply) {
		callback();
	});
};