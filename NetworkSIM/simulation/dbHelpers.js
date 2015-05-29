
var mongoUtil = require( '../mongoUtil' );

exports.saveState = function(){
	var db = mongoUtil.getDb();
	previousInfo(function(netDic,devDic){
	      db.collection('previousNetworks').update({_id: new Date()}, {_id:new Date(), networkDictionary:netDic, deviceDictionary:devDic},{upsert:true},
	   		  function(err, result){
	    	  	if (err) {throw err;}
	      	  }
	      );
	});
};

// helper thing for nameInfo
var previousInfo = exports.previousInfo = function(callback){
	var db = mongoUtil.getDb();
	var array = db.collection('networks').find();
	var devar = db.collection('devices').find();
	var index = 0;
	array.toArray(function(err, documents){
		var netDic = {};
		for (var i = 0; i < documents.length; i++){
			var temp = documents[i]._id;
			var net = JSON.parse(documents[i].jsob);
			netDic[temp]=net.connectedNetworks;
		}
		devar.toArray(function(err, docs){
			var devDic = {};
			for (var i = 0; i < docs.length; i++){
				var temp = docs[i]._id;
				var dev = JSON.parse(docs[i].jsob);
				devDic[temp] =dev.currentNetwork;
			}
			callback(netDic,devDic);
		});
	});
}

exports.getState = function(date,callback){ // i dont think this is used ever
	var db = mongoUtil.getDb();
	var array = db.collection('previousNetworks').find().sort({_id:-1});
	var index = 0;
	array.toArray(function(err, docs){
		var state=[];
		var flag = false;
		for (var i = 0;i < docs.length; i++){
			if(date>docs[i]._id){
				flag = true;
				state[0]=docs[i].networkDictionary;
				state[1]=docs[i].deviceDictionary;
				state[2] =docs[i]._id;
				break;
			}
		}
		if(!flag&&docs[docs.length-1]!==undefined){
			state[0]=docs[docs.length-1].networkDictionary;
			state[1]=docs[docs.length-1].deviceDictionary;
			state[2]=docs[docs.length-1]._id;
		}
		callback(state);
	});
};

exports.previousStates = function(callback){
	var db = mongoUtil.getDb();
	var array = db.collection('previousNetworks').find();
	var index = 0;
	array.toArray(function(err, docs){
		var states = {};
		var info = [];
		for (var i = 0;i < docs.length; i++){
			var date = docs[i]._id;
			var networks = docs[i].networkDictionary;
			var devices = docs[i].deviceDictionary;
			info[0] = networks;
			info[1] = devices;
			states[date] = info;
		}
		callback(states);
	});
};

module.exports.dropNetCollections = function(callback) {
	var db = mongoUtil.getDb();
	db.collection('devices').drop(function(err, reply) {
		db.collection('networks').drop(function(err, reply) {
			db.collection('unassignedTokens').drop(function(err, reply) {
				callback();
			});
		});
	});
};

module.exports.dropDevs = function(callback) {
	var db = mongoUtil.getDb();
	db.collection('devices').drop(function(err, reply) {
		callback();
	});
};

module.exports.dropNets = function(callback) {
	var db = mongoUtil.getDb();
	db.collection('networks').drop(function(err, reply) {
		callback();
	});
};

module.exports.dropUnAssTokens = function(callback) {
	var db = mongoUtil.getDb();
	db.collection('unassignedTokens').drop(function(err, reply) {
		callback();
	});
};

// Database function that will update the user info
exports.updateUserInfo = function(userId, username, password, hasToken, token, adminFlag, callback){
	var db = mongoUtil.getDb();
	db.collection('UserCollection').update({_id: userId}, {username: username, password: password, hasToken: hasToken, token: token, adminFlag: false},
		function (err,result){
			if (err) {throw err;}
			callback();
		});
}