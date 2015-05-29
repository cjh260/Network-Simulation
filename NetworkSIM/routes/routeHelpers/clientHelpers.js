// Requires
var admin = require('../../simulation/admin');
var dbhelp = require('../../simulation/dbHelpers');
var guid = require('../../helpers/GUID');

var networkList = require('../../simulation/networkList');
var deviceList = require('../../simulation/deviceList');

/* GET FUNCTIONS */

exports.xhrrdtsToClient = function(callback) { 
	var rdtArray = [];
	dbhelp.loadRDTS(function(rdtNameArray) {
		
		for (var i = 0; i < rdtNameArray.length; i++) {
			rdtArray[i] = rdtNameArray[i];
		}

		callback(rdtArray);
	});
};

exports.xhrappNames = function(callback){ // re used
	var appArray = [];
	dbhelp.loadAppNames(function(appNameArray){
		
		for (var i = 0; i < appNameArray.length; i++){
			appArray[i] = appNameArray[i];
		}

		callback(appArray)
	});
};

exports.getUsersDevice = function(req, res, next){
	if(req.isAuthenticated()){
			deviceList.theDeviceList.getDevice(req.user.token, function(tempDevice){
			if (tempDevice != null){
				//console.log(tempDevice);
				//console.log(tempDevice.getCurrentNetwork());
				req.userDeviceObject = tempDevice;
				var deviceName = tempDevice.getName();
				req.userDevice = deviceName;

				var deviceNetwork = tempDevice.getCurrentNetwork();

				if (deviceNetwork !== null){
					req.deviceNetwork = deviceNetwork;
				}

				else{
					req.deviceNetwork = "No network";
				}
			}

			else{
				req.userDevice = "No device";
				req.deviceNetwork = "Not paired with device";
			}
			return next();
		});
	}
	
	else{
		return next();
	}
};

// Function for sending a list of network names to the client
exports.networksToClient = function(req, res, next){
	var index = 0;
	var networkArray = [];
	var networkConnections = {};
	networkList.theNetworkList.getIterable(
		function(networkIterator){
			for (var key in networkIterator){
				if (networkIterator.hasOwnProperty(key)){
					networkArray[index] = networkIterator[key].getName();
					networkConnections[networkIterator[key].getName()] = networkIterator[key].getConnections();
					index++;
				}
			}
			
			req.networkNames = JSON.stringify(networkArray);
			req.networkConnections = JSON.stringify(networkConnections);
			return next();
		}
	);
};

// New function for XHR
exports.networksToClient2 = function(callback){
	var index = 0;
	var networkArray = [];
	var networkConnections = {};
	networkList.theNetworkList.getIterable(
		function(networkIterator){
			for (var key in networkIterator){
				if (networkIterator.hasOwnProperty(key)){
					networkArray[index] = networkIterator[key].getName();
					networkConnections[networkIterator[key].getName()] = networkIterator[key].getConnections();
					index++;
				}
			}
			
			callback(networkArray, networkConnections);
		}
	);
};

// Function for sending a list of device names to the client
exports.devicesToClient = function(req, res, next){
	var index = 0;
	var deviceArray = [];
	var deviceNetworkArray = [];
	
	deviceList.theDeviceList.getIterable(
		function(deviceIterator){
			for (var key in deviceIterator){
				if (deviceIterator.hasOwnProperty(key)){
					deviceArray[index] = deviceIterator[key].getName();
					if (deviceIterator[key].getNetwork() === null){
						deviceNetworkArray[index] = 'No network';
					}
					else{
						deviceNetworkArray[index] = deviceIterator[key].getNetwork();
					}
					index++;
				}
			}
			
			req.deviceNames = JSON.stringify(deviceArray);
			req.deviceNetworks = JSON.stringify(deviceNetworkArray);
			return next();
		}
	);
};

// New function for xhr
exports.xhrdevicesToClient = function(callback){
	var index = 0;
	var deviceArray = [];
	var deviceNetworkArray = [];
	
	deviceList.theDeviceList.getIterable(
		function(deviceIterator){
			for (var key in deviceIterator){
				if (deviceIterator.hasOwnProperty(key)){
					deviceArray[index] = deviceIterator[key].getName();
					if (deviceIterator[key].getNetwork() === null){
						deviceNetworkArray[index] = 'No network';
					}
					else{
						deviceNetworkArray[index] = deviceIterator[key].getNetwork();
					}
					index++;
				}
			}
			
			callback(deviceArray, deviceNetworkArray);
		}
	);
};

exports.states = function(req, res, next){
	var prevStates = {};
	dbhelp.previousStates(function(states){
		for (var key in states){
			if(states.hasOwnProperty(key)){
				prevStates[key] = states[key];
			}
		}
		req.previousStates = JSON.stringify(prevStates);
		return next();
	});
}