var express = require('express');
var router = express.Router();

var passport = require('passport');
require('../passport')(passport);

// Requires
var indexRoutes = require('../routes/routeHelpers/indexFunctions');
var adminRoutes = require('../routes/routeHelpers/adminstratorFunctions');
var activityRoutes = require('../routes/routeHelpers/activityFunctions');
var timeLog = require('../routes/routeHelpers/activityLog');
var clientHelpers = require('../routes/routeHelpers/clientHelpers');
var userRoutes = require('../routes/routeHelpers/userFunctions');
var viewStatesRoutes = require('../routes/routeHelpers/viewStatesFunctions');

var ensureAuthenticated = function(req, res, next) {
 	if (req.isAuthenticated()){
 		return next();
 	}

 	else{
 		res.redirect('/');
 	}
 }

 var adminFlag = function(req, res, next){
 	if (req.user.adminFlag === true){
 		next();
 	}

 	else {
 		console.log("you are not an admin!");
 		res.redirect('/user');
 	} 
 }

 var adminRedirect = function(req, res, next){
 	if (req.user.adminFlag === true){
 		res.redirect('/admin');
 	}

 	else{
 		next();
 	}
 }

/* ROUTES FOR THE INDEX PAGE */
router.get('/', indexRoutes.renderIndex);
router.post('/signUp', indexRoutes.signUp);
router.post('/login', passport.authenticate('local'), indexRoutes.userLogin);
router.post('/createAdmin', indexRoutes.createAdmin);

/* ROUTES FOR THE ADMIN PAGE */
router.get('/admin', ensureAuthenticated, adminFlag,
		clientHelpers.networksToClient, 
		clientHelpers.devicesToClient, 
		adminRoutes.renderAdmin
		);

router.post('/admin/addNetworks', adminRoutes.addNetworks);
router.post('/admin/addNetwork', adminRoutes.addNetwork);
router.post('/admin/editNetwork', adminRoutes.editNetwork);
router.post('/admin/removeNetwork', adminRoutes.removeNetwork);
router.post('/admin/removeAllNetworks', adminRoutes.removeAllNetworks);
router.post('/admin/getNetworkInfo', adminRoutes.getNetworkInfo);
router.post('/admin/connectNetworks', adminRoutes.connectNetworks);
router.post('/admin/addDevices', adminRoutes.addDevices);
router.post('/admin/addDevice', adminRoutes.addDevice);
router.post('/admin/removeDevice', adminRoutes.removeDevice);
router.post('/admin/removeAllDevices', adminRoutes.removeAllDevices);
router.post('/admin/importApp', adminRoutes.importApp);
router.post('/admin/removeApp', adminRoutes.removeApp);
router.post('/admin/removeAllApps', adminRoutes.removeAllApps);
router.post('/admin/importRDT', adminRoutes.importRDT);
router.post('/admin/removeRDT', adminRoutes.removeRDT);
router.post('/admin/removeAllRDTs', adminRoutes.removeAllRDTs);
router.post('/admin/resetDatabase', adminRoutes.resetDatabase);
router.post('/admin/joinNetwork', adminRoutes.joinNetwork);
router.post('/admin/leaveNetwork', adminRoutes.leaveNetwork);
router.post('/admin/connectNetworks', adminRoutes.connectNetworks);
router.post('/admin/useRDT', adminRoutes.useRDT);

/* ROUTES FOR ACTIVITY LOG */
router.get('/activityLog', timeLog.timeLog, activityRoutes.renderActivity);

/* ROUTES FOR USER PAGE*/
router.get('/user', ensureAuthenticated, adminRedirect,
		   clientHelpers.getUsersDevice,
		   clientHelpers.networksToClient,
		   clientHelpers.devicesToClient, 
		   userRoutes.renderUser
		   );


router.post('/user/joinNetwork', userRoutes.joinNetwork);
router.post('/user/leaveNetwork', userRoutes.leaveNetwork);
router.post('/user/logout', userRoutes.logout);
router.post('/user/register', userRoutes.registerDevice);
router.post('/user/unregister', userRoutes.unregisterDevice);

/* ROUTES FOR THE VIEW STATES PAGE */
router.get('/viewStates', 
		   clientHelpers.states,
		   clientHelpers.networksToClient, 
		   clientHelpers.devicesToClient, 
		   viewStatesRoutes.renderViewStates
		   );

router.post('/viewStates/viewTime', viewStatesRoutes.viewTime);

module.exports = router;