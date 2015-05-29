
/* GET FUNCTIONS */
exports.renderActivity = function(req, res){
	res.clearCookie('token');
	var errorMessage = req.cookies.errorMessage;
	res.clearCookie('errorMessage');
	
	if (errorMessage === undefined) {
		errorMessage = '';
	}
	res.render('activityLog', 
			  {title: 'Activity Log', 
		       errorMessage: errorMessage, 
		       timeLogs: req.logs
		      });
}