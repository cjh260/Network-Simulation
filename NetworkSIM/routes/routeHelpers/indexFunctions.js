var registerUser = require('../../simulation/registerUser');

/* GET FUNCTIONS */
exports.renderIndex = function(req, res){
	if(!(req.isAuthenticated())){
		res.render('index', { title: 'Home' });
	}

	else{
		res.redirect('/user');
		res.end();
	}
}

/* POST FUNCTIONS */
exports.userLogin = function(req, res){
	res.location('/user');
	res.end();
}

exports.signUp = function(req, res){
	if (!(req.body.username === "" || req.body.password === "")){
		registerUser.registerUser(req.body.username, req.body.password);
		res.json("User has signed up");
		res.end();
	}

	else{
		res.json("Username and password isn't filled out");
		res.end();
	}
}

exports.createAdmin = function(req, res){
	console.log("things happened");
	registerUser.createAdmin();
	res.json("Admin Account made. User: admin, password: admin");
	res.end();
}