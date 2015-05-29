
var mongoUtil = require( '../mongoUtil' );


exports.registerUser = function(username, password){
	var db = mongoUtil.getDb();
	db.collection('UserCollection').insert({username: username, password: password, hasToken: false, token: "", adminFlag: false}, // insert for username and password
		function (err, result) {
			if (err) {throw err;}
		}
	);
}

exports.createAdmin = function(){
	console.log("more things!!");
	var db = mongoUtil.getDb();
	db.collection('UserCollection').insert({username: "admin", password: "admin", hasToken: false, token: "", adminFlag: true},
		function(err, result){
			if (err) {throw err;}
		}
	);
}