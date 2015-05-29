
var mongoUtil = require( '../mongoUtil' );

// the list of unassigned device tokens
var unassignedTokenList = function() {
	
	this.push = function(token, callback){
		var db = mongoUtil.getDb();
		db.collection('unassignedTokens').insert({_id:token}, function (err, result) {
			if (err) {throw err;}
			callback();
		});
	};
	
	this.pop = function(callback) {
		var db = mongoUtil.getDb();
		db.collection('unassignedTokens').find().toArray(function(err, docs) {
			if (docs === null) {
				callback(null);
			} else {
				var token;
				if (err) {throw err;}
				if (docs.length > 0) {
					token = docs.pop()._id;
					db.collection('unassignedTokens').remove({_id:token}, function(err, res){});
				} else {
					token = null;
				}
				callback(token);
			}
		});
	};
	
	this.getToken = function(token, callback) {
		var db = mongoUtil.getDb();
		db.collection('unassignedTokens').findOne({_id:token}, function (err, result) {
				if (result === null) {
					callback(null);
				} else {
					if (err) {throw err;}
					callback(token);
				}
		});
	};
	
};

module.exports.theUnassignedTokenList = new unassignedTokenList();