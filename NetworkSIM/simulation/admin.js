var app = require('../app');
var iter = require('../helpers/Iterator');
var log = require('../simulation/activityLogging');
var guid = require('../helpers/GUID');
var networkList = require('./networkList');
var deviceList = require('./deviceList');
var mongoUtil = require( '../mongoUtil' );

// this function needs to look in the "rdts" directory for the given rdtName
// if it's a valid rdt name, initialize it ( rdt.init() ) and add it to the list of available rdts
exports.importRDT = function(rdtName){
  // Import a replicated data type to use in the simulation

  /* The RDT will have a common interface like the following after you import
   * it:
   *
   *   rdt.init(networkIterator, deviceIterator); // initiate the RDT type with your
   *   networkIterator from the simulation
   *
   * For a simple integer counter RDT, it will also have methods to increment
   * and get the value of the counter, e.g.:
   *
   *   rdt.inc(); // increment the integer counter by one
   *   rdt.val(); // get the current value of the counter
   */
	
	var db = mongoUtil.getDb();

    // log importing an rdt
    log.addTimeLog("RDT " + rdtName + " imported");
};

exports.useRDT = function(rdtName, callback) {
	networkList.theNetworkList.getIterable(function(netIt){
		deviceList.theDeviceList.getIterable(function(devIt){
			var rdtPath = '../rdts/' + rdtName + '/rdtInterface.js';
			
			if (rdtPath !== undefined) {
				var rdt;
				try {
					rdt = require(rdtPath);
				} catch (err) {
					throw new Error('RDT not found');
				}
				
				try {
					rdt.init(new iter(netIt), new iter(devIt));
					callback();
				} catch (err) {
					throw new Error('RDT failed to initialize');
				}
				
			} else {
				
		}
		});
	});
}

exports.removeRDT = function(rdtName, callback){
	// empty at the moment
};

exports.importApp = function(appName, callback){
	var db = mongoUtil.getDb();
	if (typeof appName !== 'string') {
		throw new Error('appName needs to be a string');
	} else {
		
			app.importAppt(appName);
	}

	// log importing an app
	log.addTimeLog("App " + appName + " imported");
};

exports.removeApp = function(appName, callback){
	var db = mongoUtil.getDb();
  // Remove the application from the simulation
	if (typeof appName !== 'string') {
		throw new Error('appName needs to be a string');
	} else {
		app.removeApp(appName);
	}
		
	// log removing an app
    log.addTimeLog("App " + appName + " removed");
};

var addNetwork = exports.addNetwork = function(callback){
  // Add a network with the given name and kind to the simulation
	var networkName = guid();
	networkList.theNetworkList.addNetwork(networkName, 'None', callback);
	
	// log creating a network 
	log.addTimeLog("Network " + networkName + " created");
};

var addNetworks = exports.addNetworks = function(numberOfNetworks, callback){
	if(numberOfNetworks > 0){
		addNetwork(function(net) {
			addNetworks(numberOfNetworks - 1, callback);
		});
	} else {
		callback();
	}
};

exports.removeNetwork = function(networkName, callback){
  // Remove a network with the given name from the simulation
	networkList.theNetworkList.removeNetwork(networkName, callback);
};

var addDevice = exports.addDevice = function(callback){
  // Add a device with the given name to the simulation
	var deviceName = guid();
	deviceList.theDeviceList.addDevice(deviceName, callback);
	
	// log creating a device
	log.addTimeLog("Device " + deviceName + " created");
};

var addDevices = exports.addDevices = function(numberOfDevices, callback){
	if(numberOfDevices > 0){
		addDevice(function(dev) {
			addDevices(numberOfDevices - 1, callback);
		});
	} else {
		callback();
	}
};

exports.removeDevice = function(deviceName, callback){
	deviceList.theDeviceList.removeDevice(deviceName, callback);
};