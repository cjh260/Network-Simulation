// Requires
var admin = require('../../simulation/admin');
var log = require('../../simulation/activityLogging');
var networkList = require('../../simulation/networkList');
var deviceList = require('../../simulation/deviceList');
var registerDevice = require('../../simulation/registerMobileDevice');
var dbhelp = require('../../simulation/dbHelpers');
var clientHelpers = require('./clientHelpers');

/* GET FUNCTIONS */
exports.renderUser = function(req, res) { 
	res.render('user', 
		{ title: 'User', 
	      networkName: JSON.stringify(req.deviceNetwork), 
	      UID: req.cookies.user, 
	      deviceList: req.deviceNames,
	      deviceNetworkList: req.deviceNetworks,
	      networkList: req.networkNames,
	      networkConnections: req.networkConnections,
		  appNames: JSON.stringify(req.appNames),
		  deviceName: JSON.stringify(req.userDevice)
	   }
	);
};

/* POST FUNCTIONS */

// Function for joining a network
exports.joinNetwork = function(req, res) {
	console.log("device token being used: " + req.user.token);
	console.log("join network button clicked");
	deviceList.theDeviceList.getDevice(req.user.token, function(tempDevice) {
		clientHelpers.networksToClient2(function(networkArray, networkConnections) {
			networkList.theNetworkList.getNetwork(req.body.networkInput, function(selectedNetwork) {
				clientHelpers.xhrdevicesToClient(function(deviceArray, deviceNetworkArray) {	
					
					if(selectedNetwork !== undefined) {
						tempDevice.joinNetwork(selectedNetwork, function(){
							// empty
							
						});
						console.log("join network successful here i think");
					}
					
					res.json({networkArray: networkArray, networkConnections: networkConnections, 
							  deviceArray: deviceArray, deviceNetworkArray: deviceNetworkArray, networkName: selectedNetwork.getName()});
					res.end();
				});
			});
		});
	});
};

// Function for leaving a network
exports.leaveNetwork = function(req, res) {
	deviceList.theDeviceList.getDevice(req.user.token, function(tempDevice) {
		clientHelpers.networksToClient2(function(networkArray, networkConnections) {
			clientHelpers.xhrdevicesToClient(function(deviceArray, deviceNetworkArray){
				if (tempDevice.getCurrentNetwork() !== null){
				
				networkList.theNetworkList.getNetwork(tempDevice.getCurrentNetwork(), function(selectedNetwork) {
					
					if(selectedNetwork !== undefined) {
						
						tempDevice.leaveNetwork(function(){
							// empty
						});
					}
					res.json({networkArray: networkArray, networkConnections: networkConnections, 
						      deviceArray: deviceArray, deviceNetworkArray: deviceNetworkArray, networkName: "No network"});
					res.end();
				});
				} else {
					res.json({networkArray: networkArray, networkConnections: networkConnections,
						      deviceArray: deviceArray, deviceNetworkArray: deviceNetworkArray, networkName: "No network"});
					res.end();
				}
			});
		});
	});
};

// Log the user out
exports.logout = function(req, res) {
	req.logout();
	res.location('/');
	res.end();
};

// Registers a token device
exports.registerDevice = function(req, res, next){
	if (!req.user.hasToken){
		registerDevice.theUnassignedTokenList.pop(function(token) { // finds an unassigned token from simulation
			if (token != null){ // updates user creds if there is a token
				dbhelp.updateUserInfo(req.user._id, req.user.username, req.user.password, true, token, false, function(){
					req.user.hasToken = true; // updates session
					req.user.token = token; // updates session
					deviceList.theDeviceList.getDevice(req.user.token, function(tempDevice){
						res.json({deviceName: token, networkName: tempDevice.getCurrentNetwork()});
						res.end();
					});
				});
			} else{
				res.end();
			}	
		});
	} else{
		res.end();
	}
}

// Unregister the device the user is on
exports.unregisterDevice = function(req, res) {
	if (req.user.hasToken){
		registerDevice.theUnassignedTokenList.push(req.user.token, function(){
			dbhelp.updateUserInfo(req.user._id, req.user.username, req.user.password, false, "", false, function(){
				req.user.hasToken = false; // updates session
				req.user.token = ""; // updates session
				res.json({deviceName: "No device"});
				res.end();
			});
		});
	}

	else{
		res.end();
	}
};
