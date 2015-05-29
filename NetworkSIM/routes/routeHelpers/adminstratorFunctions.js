// Requires
var admin = require('../../simulation/admin');
var log = require('../../simulation/activityLogging');
var dbhelp = require('../../simulation/dbHelpers');
var guid = require('../../helpers/GUID');
var clientHelpers = require('../../routes/routeHelpers/clientHelpers');
var networkList = require('../../simulation/networkList');
var deviceList = require('../../simulation/deviceList');

var mongoUtil = require( '../../mongoUtil' );


var fs = require("fs");
var unzip = require('unzip');

var writeToRes = function(res){
	clientHelpers.networksToClient2(function(networkArray, networkConnections) {
		clientHelpers.xhrdevicesToClient(function(deviceArray, deviceNetworkArray) {
			res.json({deviceArray: deviceArray, deviceNetworkArray: deviceNetworkArray,
				networkArray:networkArray,networkConnections:networkConnections});
			res.end();
		});
	});
}
/* GET FUNCTIONS */
// Function for rendering the admin page
exports.renderAdmin = function(req, res) {
	
	var errorMessage = req.cookies.errorMessage;
	res.clearCookie('errorMessage');
	
	if (errorMessage === undefined) {
		errorMessage = '';
	}
	
	if (req.cookies.networkInfo !== undefined) {
		res.render('administrator', 
				{title: 'Administrator', 
			     networkList: req.networkNames, 
				 networkInfo: JSON.stringify(req.cookies.networkInfo), 
				 appNames: JSON.stringify(req.appNames),
				 rdtList: JSON.stringify(req.rdtNames),
				 deviceList: req.deviceNames,
				 deviceNetworkList: req.deviceNetworks,
				 networkConnections: req.networkConnections,
				 errorMessage: errorMessage
				}
		);
	} else {
		res.render('administrator', 
				{title: 'Adminstrator', 
			     networkList: req.networkNames, 
			     networkInfo: 1,
			     appNames: JSON.stringify(req.appNames),
			     rdtList: JSON.stringify(req.rdtNames),
			     deviceList: req.deviceNames,
			     deviceNetworkList: req.deviceNetworks,
			     networkConnections: req.networkConnections,
			     errorMessage: errorMessage
			    }
		);
	}
};	
	
/* ROUTE FUNCTIONS */

/* Function for adding any number of networks to the simulation
 * each network gets assigned a unique token as it's networkName
 * and it gets a default networkType
 * Initially there are NO devices connected to a network
 * When a user "logs in" with a valid deviceName, 
 * they have access to that virtual device.
 * They select which network to join/leave.
 */
exports.addNetworks = function(req, res) {
	admin.addNetworks(req.body.numNetworks, function(){
		dbhelp.saveState();
		writeToRes(res);
	});
};

exports.addNetwork = function(req, res) {
	admin.addNetwork(function() {
		writeToRes(res);
	});
	
};

// Modify network properties
exports.editNetwork = function(req, res) {
	var selectedNetwork = req.body.networkValue;
	var editNetworkName = req.body.networkName;
	var editNetworkType = req.body.networkType;

	if(selectedNetwork !== 'undefined') {
		networkList.theNetworkList.getNetwork(selectedNetwork, function(selNet){
			if(selectedNetwork !== editNetworkName && selNet.getKind() !== editNetworkType) { // name and kind has changed
				networkList.theNetworkList.editNetwork(selectedNetwork, editNetworkName, editNetworkType, function(net){
					res.cookie('errorMessage', 'Updated network name and kind');
					writeToRes(res);
				});
			} else if(selectedNetwork !== editNetworkName && selNet.getKind() === editNetworkType) {// name has changed
				networkList.theNetworkList.editNetwork(selectedNetwork, editNetworkName, selNet.getKind(), function(net){
					res.cookie('errorMessage', 'Updated network name');
					writeToRes(res);
				});
			} else if(selectedNetwork === editNetworkName && selNet.getKind() !== editNetworkType) { // kind has changed
				networkList.theNetworkList.editNetwork(selectedNetwork, selNet.getName(), editNetworkType, function(net){
					res.cookie('errorMessage', 'Updated network kind');
					writeToRes(res);
				});
			} else { //nothing has changed so don't update 
				res.cookie('errorMessage', 'Nothing to update');
				res.end();
			}
		});
	} else {
		res.cookie('errorMessage', 'Please select a network');
		res.end();
	}
};

// Remove a network from the simulation
exports.removeNetwork = function(req, res, next) {
	var selectedNetwork = req.body.networkValue;
	networkList.theNetworkList.removeNetwork(selectedNetwork, function(net) {
		if (net === null) {
			res.cookie('errorMessage', 'Please select a network');
		} else {
			res.cookie('errorMessage', 'Network removed');
		}
		writeToRes(res);
		
	});
};

//Remove all networks from the simulation
exports.removeAllNetworks = function(req, res) {
	dbhelp.dropNets(function() {
		res.cookie('errorMessage', 'All networks removed');
		writeToRes(res);
	});
};

// Get network info for the drop down box on admin page
exports.getNetworkInfo = function(req, res) {
	var selectedNetwork = req.body.networkValue;
	
	networkList.theNetworkList.getNetwork(selectedNetwork, function(net) {
		if (net !== null) {
			res.json(net.getKind());
		}
		
		res.end();
	});
	
};

exports.joinNetwork = function(req, res){
	deviceList.theDeviceList.getDevice(req.body.deviceInput, function(tempDevice) {
		networkList.theNetworkList.getNetwork(req.body.networkInput, function (selectedNetwork) {
			if(selectedNetwork !== undefined){
				tempDevice.joinNetwork(selectedNetwork, function(){
					clientHelpers.networksToClient2(function(networkArray, networkConnections) {
						clientHelpers.xhrdevicesToClient(function(deviceArray, deviceNetworkArray) {
							res.json({deviceArray: deviceArray, deviceNetworkArray: deviceNetworkArray,
								networkArray:networkArray,networkConnections:networkConnections, networkName: selectedNetwork.getName()});
							res.end();
						});
					});
				});
			} else {
				res.end();
			}
		});
	});
};

exports.leaveNetwork = function(req, res){
	deviceList.theDeviceList.getDevice(req.body.deviceInput, function(tempDevice) {
		if (tempDevice.getCurrentNetwork() !== null){
			networkList.theNetworkList.getNetwork(tempDevice.getCurrentNetwork(), function(selectedNetwork) {
				if(selectedNetwork !== undefined) {
					tempDevice.leaveNetwork(function() {
						writeToRes(res);
					});
				} else {
					res.end();
				}
			});
		} else {
			res.end();
		}
	});
};

exports.connectNetworks = function(req, res){
	networkList.theNetworkList.getNetwork(req.body.networkValue, function(selectedNetwork){
		networkList.theNetworkList.getNetwork(req.body.connect2, function(connect2){
			if(selectedNetwork.connectedNetworks.indexOf(connect2.name) <= -1) {
				if (req.body.networkValue !== req.body.connect2) {
					selectedNetwork.connectNetwork(connect2.name, function() {
						connect2.connectNetwork(selectedNetwork.name, function(){
							res.cookie('errorMessage', 'Connected networks');
							writeToRes(res);
						});
					});
				} else {
					res.cookie('errorMessage', 'Cannot connect a network to itself!');
					res.end();
				}
			} else {
				if (req.body.connect1 !== req.body.connect2) {
					selectedNetwork.disconnectNetwork(connect2.name, function(){
						connect2.disconnectNetwork(selectedNetwork.name, function(){
							res.cookie('errorMessage', 'Disconnected networks');
							writeToRes(res);
						});
					});
				} else {
					res.cookie('errorMessage', 'Cannot disconnect a network from itself!');
					res.json(networkConnections);
					res.end();
				}
			}
		});
	});
};

exports.addDevices = function(req, res) {
	var numDevices = req.body.numDevices;
	
	admin.addDevices(numDevices, function() {
		writeToRes(res);
	});
};

exports.addDevice = function(req, res){
	admin.addDevice(function(){
		writeToRes(res);
	});
};

// Remove a device from the simulation
exports.removeDevice = function(req, res) {
	var selectedDevice = req.body.deviceValue;
	
	deviceList.theDeviceList.removeDevice(selectedDevice, function(dev) {
		if (dev === null) {
			res.cookie('errorMessage', 'Please select a device');
		} else {
			res.cookie('errorMessage', 'Device removed');
		}
		writeToRes(res);
	});
};

//Remove all devices from the simulation
exports.removeAllDevices = function(req, res) {
	dbhelp.dropDevs(function(){
		dbhelp.dropUnAssTokens(function(){
			res.cookie('errorMessage', 'All devices removed');
			writeToRes(res);
		});
	});
};



// Import an app into the simulation
exports.importApp = function(req, res, next) {
	try {
		fs.createReadStream('./uploads/' + req.files.uploads.name).pipe(unzip.Extract({ path: './apps' }));
	
		admin.importApp(req.files.uploads.originalname.slice(0, -4), function(){
			clientHelpers.xhrappNames(function(appArray) {
				res.json(appArray);
				res.end();
			});
		});
	
	} catch (err) {
		return next();
	}
};

// Remove an app from the simulation
exports.removeApp = function(req, res) {
	var tempAppName = req.body.appValue;
	admin.removeApp(tempAppName, function(){
		clientHelpers.xhrappNames(function(appArray) {
			try {
				res.cookie('errorMessage', 'App removed');
			} catch (err) {
				res.cookie('errorMessage', 'Please select an app');
			}
			
			res.json(appArray);
			res.end();
		});
	});
	
};

//Remove all apps from the simulation
exports.removeAllApps = function(req, res) {
	dbhelp.dropApps(function(){
		clientHelpers.xhrappNames(function(appArray) {
			res.cookie('errorMessage', 'All apps removed');
			res.json(appArray);
			res.end();
		});
	});
};

// Import an rdt into the simluation
exports.importRDT = function(req, res, next) {
	try {
		fs.createReadStream('./uploads/' + req.files.uploads.name).pipe(unzip.Extract({ path: './rdts' }));
	
		admin.importRdt(req.files.uploads.originalname.slice(0, -4), function(){
			clientHelpers.xhrrdtNames(function(rdtArray) {
				res.json(rdtArray);
				res.end();
			});
		});
	
	} catch (err) {
		return next();
	}
};

// Remove an rdt from the simulation
exports.removeRDT = function(req, res){
	var tempRDTName = req.body.RDTValue;
	admin.removeRDT(tempRDTName, function(){
		clientHelpers.xhrrdtNames(function(rdtArray) {
			if(tempRDTName !== undefined && tempRDTName !== null){
				try {
					
					res.cookie('errorMessage', 'RDT removed');
				} catch (err) {
					console.log(err);
					res.cookie('errorMessage', 'Please select an RDT');
				}
			} else {
				res.cookie('errorMessage', 'Please select an RDT');
			}
			
			res.json(rdtArray);
			res.end();
		});
	});
	
};

//Remove all RDTs from the simulation
exports.removeAllRDTs = function(req, res){
	dbhelp.dropRdts(function(){
		clientHelpers.xhrrdtNames(function(rdtArray) {
			res.cookie('errorMessage', 'All RDTs removed');
			res.json(rdtArray);
			res.end();
		});
	});
};

//Resets the database
exports.resetDatabase = function(req, res){
	var db = mongoUtil.getDb();
	db.dropDatabase(function() {
		res.cookie('errorMessage', 'Database reset');
		res.end();
	});
};

exports.useRDT = function(req, res){
	admin.useRDT(req.body.RDTValue, function(){
		res.end();
	});
}