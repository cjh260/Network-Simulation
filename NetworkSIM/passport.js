// passport session setup
// ables presistent login sessions
// passport has ability to serialize and unserialize users of a session

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ObjectId = require('mongodb').ObjectId;
var mongoUtil = require( './mongoUtil' );

exports.ensureAuthenticated = function(req, res, next) {
 	if (req.isAuthenticated()){
 		return next();
 	}

 	else{
 		res.redirect('/');
 	}
 }

module.exports = function(passport){
	// serialize the user
	passport.serializeUser(function(user, done){
		done(null, user);
	});

	// deserialize the user 
	passport.deserializeUser(function(user, done){
		var db = mongoUtil.getDb();
		var objectId = new ObjectId(user._id);
		db.collection('UserCollection').findOne({_id: objectId}, function(err, docs) {
			done(err, docs);
		});
	});

    // LOCAL SIGNUP
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

	passport.use('local', new LocalStrategy(  // Strategy for passports
		{
			usernameField: 'loginName',
			passwordField: 'loginPassword',
		},

		function(username, password, done){
			var db = mongoUtil.getDb();
			process.nextTick(function(){ //process.nextTick is for asynchronous purpose
				db.collection('UserCollection').findOne({username: username}, function(err, user){
					if (err) {return done(err);} // database not available		

					if (!user){  // checks for user
						return done(null, false, {message: "Incorrect username."});
					}		

					if (user.password != password){ // if user found, checks password
						return done(null, false, {message: "Incorrect password"});
					}		
					return done(null, user); // success
				});
			})
		}
	)); 
}